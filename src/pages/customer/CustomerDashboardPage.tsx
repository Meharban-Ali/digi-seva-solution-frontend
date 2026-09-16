import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  getCustomerAppointments,
  getCustomerEnquiries,
  updateCustomerProfile,
  uploadCustomerProfilePhoto,
  removeCustomerProfilePhoto,
} from "@/api/customerPortalApi";
import { CustomerAppointment, CustomerEnquiry } from "@/types/customer.types";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { SeoHead } from "@/components/common/SeoHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Clock,
  MapPin,
  CheckCircle2,
  Hourglass,
  FileCheck,
  Phone,
  Mail,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Shield,
  Camera,
  Trash2,
} from "lucide-react";

export function CustomerDashboardPage() {
  const { t } = useTranslation();
  const { customer, logout, setCustomer } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"APPOINTMENTS" | "ENQUIRIES" | "PROFILE">("APPOINTMENTS");
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Profile Form State
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Profile Photo Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);

  // Expanded Appointment IDs for document checklist view
  const [expandedAppIds, setExpandedAppIds] = useState<Record<number, boolean>>({});

  const toggleExpandDocs = (id: number) => {
    setExpandedAppIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [appData, enqData] = await Promise.all([
        getCustomerAppointments(),
        getCustomerEnquiries(),
      ]);
      setAppointments(appData);
      setEnquiries(enqData);
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingProfile(true);
    try {
      const updated = await updateCustomerProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      setCustomer(updated);
      toast.success(t("customerDashboard.profileUpdated", "Profile updated successfully!"));
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update profile."));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const updated = await uploadCustomerProfilePhoto(file);
      setCustomer(updated);
      toast.success("Profile photo updated successfully!");
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to upload photo."));
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePhotoRemove = async () => {
    setIsRemovingPhoto(true);
    try {
      const updated = await removeCustomerProfilePhoto();
      setCustomer(updated);
      toast.success("Profile photo removed successfully!");
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to remove photo."));
    } finally {
      setIsRemovingPhoto(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "CONFIRMED" || s === "RESOLVED" || s === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {status}
        </span>
      );
    }
    if (s === "CONTACTED") {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
          <MessageSquare className="h-3.5 w-3.5 text-blue-600" /> Contacted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
        <Hourglass className="h-3.5 w-3.5 text-amber-600" /> {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SeoHead
        title="My Customer Portal - Digi Seva Solution"
        description="View your bookings, enquiries, required document status, and manage your account."
        path="/customer/dashboard"
      />

      {/* Profile Banner */}
      <Card className="border border-slate-200/90 border-l-4 border-l-orange-500 shadow-md bg-white overflow-hidden rounded-2xl">
        <div className="bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#0B2046] border-2 border-orange-200 text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-xs relative">
                {isUploadingPhoto ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-orange-400" />
                ) : customer?.profileImageUrl ? (
                  <img
                    src={customer.profileImageUrl}
                    alt={customer.name || "Customer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{customer?.name ? customer.name.charAt(0).toUpperCase() : "C"}</span>
                )}
              </div>

              {/* Camera Overlay Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                title="Upload Profile Photo"
                className="absolute bottom-0 right-0 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md transition-transform hover:scale-110 focus:outline-none"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0B2046]">{customer?.name}</h1>
                <span className="bg-orange-50 text-[#0B2046] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1 shadow-2xs">
                  <Shield className="h-3 w-3 text-orange-500" /> Customer Account
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-orange-500" /> {customer?.email}
                </span>
                {customer?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-orange-500" /> {customer.phone}
                  </span>
                )}
              </div>
              {customer?.profileImageUrl && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  disabled={isRemovingPhoto}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 mt-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> {isRemovingPhoto ? "Removing..." : "Remove Photo"}
                </button>
              )}
            </div>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold flex items-center gap-1.5 self-end sm:self-auto shadow-2xs"
          >
            <LogOut className="h-4 w-4 text-slate-500" /> Log Out
          </Button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("APPOINTMENTS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "APPOINTMENTS"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="h-4 w-4" /> My Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab("ENQUIRIES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "ENQUIRIES"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="h-4 w-4" /> My Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "PROFILE"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="h-4 w-4" /> Edit Profile
        </button>
      </div>

      {/* Main Tab Content */}
      {isLoadingData ? (
        <div className="p-12 text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading your account history...</p>
        </div>
      ) : activeTab === "APPOINTMENTS" ? (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card className="border-dashed border-slate-300 p-8 text-center bg-slate-50">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-base">No Appointments Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't booked any appointments yet. When you book appointments on Digi Seva Solution, they will automatically appear here!
              </p>
            </Card>
          ) : (
            appointments.map((app) => {
              const isExpanded = !!expandedAppIds[app.id];
              const docs = app.requiredDocuments || [];
              const totalDocs = docs.length;
              const receivedDocs = docs.filter((d) => d.isReceived).length;

              const statusUpper = (app.status || "").toUpperCase();
              let borderStatusClass = "border-l-4 border-l-amber-500";
              if (statusUpper === "CONFIRMED") borderStatusClass = "border-l-4 border-l-blue-500";
              else if (statusUpper === "COMPLETED" || statusUpper === "RESOLVED") borderStatusClass = "border-l-4 border-l-emerald-500";
              else if (statusUpper === "CANCELLED") borderStatusClass = "border-l-4 border-l-rose-500";

              return (
                <Card key={app.id} className={`border-slate-200 shadow-xs hover:shadow-md transition-shadow bg-white overflow-hidden rounded-xl ${borderStatusClass}`}>
                  <CardHeader className="p-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">#{app.id}</span>
                        <h3 className="font-black text-[#0B2046] text-base">{app.serviceName}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="h-3.5 w-3.5 text-orange-500" /> {app.appointmentDate}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="h-3.5 w-3.5 text-orange-500" /> {app.appointmentTime}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" /> New Ashok Nagar Center
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4">
                    {app.notes && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-slate-900">Notes:</strong> {app.notes}
                      </div>
                    )}

                    {/* Document Checklist Accordion Section */}
                    {totalDocs > 0 && (
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => toggleExpandDocs(app.id)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-slate-800">
                              Required Document Checklist ({receivedDocs}/{totalDocs} Verified)
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                receivedDocs === totalDocs
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {receivedDocs === totalDocs ? "All Received" : `${totalDocs - receivedDocs} Pending`}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-3 border-t border-slate-200 space-y-2 bg-white animate-in fade-in">
                            <p className="text-[11px] text-slate-500 mb-2">
                              Center staff will mark items as received when you visit. This checklist is read-only for your tracking.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {docs.map((doc) => (
                                <div
                                  key={doc.checklistItemId}
                                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 text-xs ${
                                    doc.isReceived
                                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                                      : "bg-slate-50 border-slate-200 text-slate-700"
                                  }`}
                                >
                                  {doc.isReceived ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Hourglass className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <p className="font-bold">{doc.itemEn}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">{doc.itemHi}</p>
                                    <div className="mt-1">
                                      {doc.isReceived ? (
                                        <span className="text-[10px] font-bold text-emerald-700">
                                          ✓ Received & Verified by Center Staff
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-amber-700">
                                          ⏳ Pending — Please bring when visiting
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : activeTab === "ENQUIRIES" ? (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <Card className="border-dashed border-slate-300 p-8 text-center bg-slate-50">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-base">No Enquiries Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't submitted any online enquiries yet.
              </p>
            </Card>
          ) : (
            enquiries.map((enq) => (
              <Card key={enq.id} className="border-slate-200 shadow-xs bg-white rounded-xl">
                <CardHeader className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-bold text-slate-400">#ENQ-{enq.id}</span>
                    <p className="text-xs text-slate-500">Submitted on {new Date(enq.createdAt).toLocaleDateString()}</p>
                  </div>
                  {getStatusBadge(enq.status)}
                </CardHeader>
                <CardContent className="p-4 sm:p-5 space-y-2">
                  {enq.message ? (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{enq.message}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No message text recorded.</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Profile Management Form */
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl max-w-xl">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Manage Contact Details
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Update your personal details. Changes will reflect across your booking records.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address (Verified Login)
                </label>
                <input
                  type="email"
                  disabled
                  value={customer?.email || ""}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="editName" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  id="editName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="editPhone" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  id="editPhone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || !name.trim()}
                  className="font-bold bg-primary hover:bg-primary/90 text-white"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CustomerDashboardPage;
