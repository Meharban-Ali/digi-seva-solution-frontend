import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getAdminCustomers,
  getAdminCustomerById,
  getAdminCustomerStats,
  getAdminCustomerAppointments,
  getAdminCustomerEnquiries,
  getAdminCustomerCallbacks,
  updateAdminCustomerNote,
  updateAdminCustomer,
  deleteAdminCustomer,
  CustomerAdmin,
  CustomerDetailAdmin,
  CustomerStats,
} from "@/api/adminCustomerApi";
import { CustomerAppointment, CustomerEnquiry, CustomerCallback } from "@/types/customer.types";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  UserCheck,
  Search,
  Eye,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  RefreshCw,
  X,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Lock,
  Save,
  StickyNote,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export function ManageCustomers() {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState<CustomerAdmin[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // View Details Dialog State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerDetail, setCustomerDetail] = useState<CustomerDetailAdmin | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Sub-resource Modal State
  const [modalTab, setModalTab] = useState<"APPOINTMENTS" | "ENQUIRIES" | "CALLBACKS">("APPOINTMENTS");
  const [modalAppointments, setModalAppointments] = useState<CustomerAppointment[]>([]);
  const [modalEnquiries, setModalEnquiries] = useState<CustomerEnquiry[]>([]);
  const [modalCallbacks, setModalCallbacks] = useState<CustomerCallback[]>([]);

  // Admin Note State
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<{ id: number; name: string; phone: string } | null>(null);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);

  // Delete Customer Modal State
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerAdmin | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getAdminCustomerStats();
      setStats(data);
    } catch (err: unknown) {
      console.error("Failed to load customer stats:", err);
    }
  };

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCustomers({
        search: search.trim() || undefined,
        page,
        size: pageSize,
      });
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to load customers list."));
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCustomers();

    // Instant status change listener across tabs/windows
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("customer_status_channel");
        channel.onmessage = (event) => {
          if (event.data?.type === "CUSTOMER_LOGIN" || event.data?.type === "CUSTOMER_LOGOUT") {
            fetchCustomers();
            fetchStats();
          }
        };
      }
    } catch {
      // Ignore broadcast channel errors
    }

    const handleCustomStatusChange = () => {
      fetchCustomers();
      fetchStats();
    };
    window.addEventListener("customer_status_change", handleCustomStatusChange);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener("customer_status_change", handleCustomStatusChange);
    };
  }, [fetchCustomers]);

  const handleOpenDetail = async (id: number) => {
    setSelectedCustomerId(id);
    setIsLoadingDetail(true);
    setModalTab("APPOINTMENTS");
    try {
      const [detail, apps, enqs, callbacks] = await Promise.all([
        getAdminCustomerById(id),
        getAdminCustomerAppointments(id),
        getAdminCustomerEnquiries(id),
        getAdminCustomerCallbacks(id),
      ]);
      setCustomerDetail(detail);
      setModalAppointments(apps);
      setModalEnquiries(enqs);
      setModalCallbacks(callbacks);

      const found = customers.find((c) => c.id === id);
      setAdminNoteInput(found?.adminNote || "");
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to load customer details."));
      setSelectedCustomerId(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedCustomerId(null);
    setCustomerDetail(null);
    setAdminNoteInput("");
  };

  const handleSaveAdminNote = async () => {
    if (!selectedCustomerId) return;
    setIsSavingNote(true);
    try {
      const updated = await updateAdminCustomerNote(selectedCustomerId, adminNoteInput);
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomerId ? { ...c, adminNote: updated.adminNote } : c))
      );
      toast.success("Admin note saved successfully!");
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to save admin note."));
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleStartEdit = (customer: CustomerAdmin) => {
    setEditingCustomer({
      id: customer.id,
      name: customer.name || "",
      phone: customer.phone || "",
    });
  };

  const handleSaveEditCustomer = async () => {
    if (!editingCustomer) return;
    if (!editingCustomer.name.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    setIsUpdatingCustomer(true);
    try {
      const updated = await updateAdminCustomer(editingCustomer.id, {
        name: editingCustomer.name.trim(),
        phone: editingCustomer.phone.trim() || undefined,
      });
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, name: updated.name, phone: updated.phone } : c))
      );
      toast.success("Customer details updated successfully!");
      setEditingCustomer(null);
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update customer details."));
    } finally {
      setIsUpdatingCustomer(false);
    }
  };

  const handleStartDelete = (customer: CustomerAdmin) => {
    setDeletingCustomer(customer);
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    setIsDeletingCustomer(true);
    try {
      await deleteAdminCustomer(deletingCustomer.id);
      toast.success(`Customer #${deletingCustomer.id} deleted successfully.`);
      setDeletingCustomer(null);
      fetchCustomers();
      fetchStats();
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to delete customer."));
    } finally {
      setIsDeletingCustomer(false);
    }
  };

  // Mask phone number (e.g. 7900867261 -> 79****61)
  const maskPhone = (phone?: string) => {
    if (!phone) return "N/A";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 4) return "****";
    return `${cleaned.substring(0, 2)}****${cleaned.substring(cleaned.length - 2)}`;
  };

  const formatLastActive = (timestamp?: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "CONFIRMED" || s === "RESOLVED" || s === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {status}
        </span>
      );
    }
    if (s === "CONTACTED") {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
          <MessageSquare className="h-3 w-3 text-blue-600" /> Contacted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
        <Hourglass className="h-3 w-3 text-amber-600" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#0B2046]" />
            {t("customer.manageTitle", "Customer Account Management")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t("customer.manageSubtitle", "View registered customer accounts, online status, booking history, and enquiry tracking.")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchStats();
            fetchCustomers();
          }}
          className="font-bold flex items-center gap-1.5 self-start sm:self-auto border-slate-300 shadow-2xs"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* 1. Stats Row (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t("customer.totalCustomers", "Total Customers")}
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-[#0B2046]/10 text-[#0B2046] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-[#0B2046]">
              {stats ? stats.totalCustomers : "—"}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t("customer.newThisMonth", "New This Month")}
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-emerald-700">
              {stats ? stats.newThisMonth : "—"}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              {t("customer.activeThisWeek", "Active This Week")}
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-blue-700">
              {stats ? stats.activeThisWeek : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={t("customer.searchPlaceholder", "Search by customer name, email, or phone number...")}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* 3. Customer List Table */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0B2046] mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading registered customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-700 text-base">
              {t("customer.emptyTitle", "No Customers Registered Yet")}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t("customer.emptyDesc", "Registered customer accounts will appear here automatically when citizens sign in.")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                  <th className="p-3.5 pl-4">#</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Registered On</th>
                  <th className="p-3.5">Last Active</th>
                  <th className="p-3.5 text-center">Appointments</th>
                  <th className="p-3.5 text-center">Enquiries</th>
                  <th className="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">#{c.id}</td>
                    <td className="p-3.5">
                      {c.isLoggedIn ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                          <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-[#0B2046] text-white font-black text-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                          {c.profileImageUrl ? (
                            <img src={c.profileImageUrl} alt={c.name} className="h-full w-full object-cover" />
                          ) : (
                            <span>{c.name ? c.name.charAt(0).toUpperCase() : "C"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          {c.adminNote && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              <StickyNote className="h-2.5 w-2.5" /> Note attached
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{c.email}</td>
                    <td className="p-3.5 font-mono text-slate-600">{maskPhone(c.phone)}</td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      {formatLastActive(c.lastActiveAt)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-block bg-orange-50 text-orange-700 font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                        {c.appointmentCount}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-block bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                        {c.enquiryCount}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDetail(c.id)}
                          title="View Details"
                          className="font-bold border-slate-300 text-slate-700 hover:bg-[#0B2046] hover:text-white transition-colors h-8 px-2.5"
                        >
                          <Eye className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(c)}
                          title="Edit Customer"
                          className="font-bold border-slate-300 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors h-8 px-2.5"
                        >
                          <Pencil className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartDelete(c)}
                          title="Delete Customer"
                          className="font-bold border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors h-8 px-2.5"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50">
            <span className="text-slate-500 font-medium">
              Showing page {page + 1} of {totalPages} ({totalElements} customers)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Customer View Details Dialog Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-3xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <CardHeader className="p-5 bg-[#0B2046] text-white flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-500 text-white font-black text-xl flex items-center justify-center overflow-hidden border-2 border-orange-200 shadow-sm">
                  {customerDetail?.profile?.profileImageUrl ? (
                    <img
                      src={customerDetail.profile.profileImageUrl}
                      alt={customerDetail.profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{customerDetail?.profile?.name ? customerDetail.profile.name.charAt(0).toUpperCase() : "C"}</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-white">
                    {customerDetail?.profile?.name || "Customer Detail"}
                  </CardTitle>
                  <p className="text-xs text-slate-300 font-mono">
                    Customer ID: #{selectedCustomerId}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseDetail}
                className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto space-y-6">
              {isLoadingDetail ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#0B2046] mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">Loading customer profile details...</p>
                </div>
              ) : customerDetail ? (
                <>
                  {/* Full Unmasked Profile Info */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Email Address</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3.5 w-3.5 text-orange-500" /> {customerDetail.profile.email}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Phone (Unmasked)</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3.5 w-3.5 text-orange-500" /> {customerDetail.profile.phone || "Not provided"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block uppercase text-[10px]">Registered On</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-orange-500" /> {new Date(customerDetail.profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Admin Notes Section */}
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="adminNoteArea" className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-amber-700" />
                        Admin Notes <span className="text-[10px] text-amber-700 font-normal">(Internal Only — Not visible to customer)</span>
                      </label>
                      <Button
                        size="sm"
                        disabled={isSavingNote}
                        onClick={handleSaveAdminNote}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs h-7 px-3 flex items-center gap-1"
                      >
                        <Save className="h-3 w-3" />
                        {isSavingNote ? "Saving..." : "Save Note"}
                      </Button>
                    </div>
                    <textarea
                      id="adminNoteArea"
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      onBlur={handleSaveAdminNote}
                      placeholder="Add internal notes about this customer (e.g. preferred contact hours, document status, special requests)..."
                      className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Modal Sub-resource Tabs */}
                  <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setModalTab("APPOINTMENTS")}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap ${
                        modalTab === "APPOINTMENTS"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" /> Their Appointments ({modalAppointments.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalTab("ENQUIRIES")}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap ${
                        modalTab === "ENQUIRIES"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Their Enquiries ({modalEnquiries.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalTab("CALLBACKS")}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold border-b-2 transition-colors whitespace-nowrap ${
                        modalTab === "CALLBACKS"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Their Callbacks ({modalCallbacks.length})
                    </button>
                  </div>

                  {/* Tab Content */}
                  {modalTab === "APPOINTMENTS" ? (
                    <div className="space-y-3">
                      {modalAppointments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                          No appointments booked by this customer.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {modalAppointments.map((app) => (
                            <div key={app.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-400">#{app.id}</span>
                                  <span className="font-extrabold text-[#0B2046]">{app.serviceName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                  <span>📅 {app.appointmentDate}</span>
                                  <span>⏰ {app.appointmentTime}</span>
                                </div>
                              </div>
                              {getStatusBadge(app.status)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : modalTab === "ENQUIRIES" ? (
                    <div className="space-y-3">
                      {modalEnquiries.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                          No enquiries submitted by this customer.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {modalEnquiries.map((enq) => (
                            <div key={enq.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-slate-400">#ENQ-{enq.id}</span>
                                {getStatusBadge(enq.status)}
                              </div>
                              {enq.message && (
                                <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  "{enq.message}"
                                </p>
                              )}
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Submitted on {new Date(enq.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {modalCallbacks.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                          No callback requests found matching this customer's phone number.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {modalCallbacks.map((cb) => (
                            <div key={cb.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-400">#CB-{cb.id}</span>
                                  <span className="font-extrabold text-[#0B2046]">{cb.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-mono">
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-orange-500" /> {cb.phone}
                                  </span>
                                  {cb.preferredTime && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-orange-500" /> {cb.preferredTime}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {getStatusBadge(cb.status)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 5. Edit Customer Modal Dialog */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="p-4 bg-[#0B2046] text-white flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black flex items-center gap-2 text-white">
                <Pencil className="h-4 w-4 text-orange-400" />
                Edit Customer Details
              </CardTitle>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="Enter customer name..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2046]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  placeholder="Enter phone number..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2046] font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCustomer(null)}
                  className="font-bold border-slate-300 text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isUpdatingCustomer}
                  onClick={handleSaveEditCustomer}
                  className="bg-[#0B2046] hover:bg-[#15346e] text-white font-bold text-xs h-8 flex items-center gap-1.5"
                >
                  {isUpdatingCustomer ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. Delete Customer Modal Dialog */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="p-4 bg-rose-900 text-white flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-rose-300" />
                Delete Customer Account?
              </CardTitle>
              <button
                onClick={() => setDeletingCustomer(null)}
                className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-rose-900">
                <p className="font-extrabold text-xs">Warning: This action cannot be undone.</p>
                <p className="text-[11px] leading-relaxed">
                  You are about to delete the customer account for{" "}
                  <strong className="font-bold underline">{deletingCustomer.name}</strong> ({deletingCustomer.email}).
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  Note: Any existing appointments or enquiries made by this customer will be safely unlinked (preserved as guest records) so your system history remains intact.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingCustomer(null)}
                  className="font-bold border-slate-300 text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isDeletingCustomer}
                  onClick={handleConfirmDeleteCustomer}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-8 flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeletingCustomer ? "Deleting..." : "Delete Customer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ManageCustomers;
