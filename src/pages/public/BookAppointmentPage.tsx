import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getSlotAvailability, bookAppointment } from "@/features/appointment/appointmentApi";
import { useServices } from "@/hooks/useServices";
import { AppointmentResponse, SlotAvailability } from "@/types/appointment.types";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { SeoHead } from "@/components/common/SeoHead";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/common/LoadingButton";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  serviceName: z.string().optional(),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// Helper functions for date formatting in IST
function getNowInIST(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function formatIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayNameShort(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getMonthNameShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function getFullFormattedDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function BookAppointmentPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: services } = useServices();

  const todayIST = getNowInIST();

  // Generate 7 days array starting from today (BUG 1 FIX: Today is selectable)
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = getNowInIST();
    d.setDate(todayIST.getDate() + i);
    const isToday = isSameDay(d, todayIST);
    return {
      dateObj: d,
      isoDate: formatIsoDate(d),
      dayName: getDayNameShort(d),
      dayNumber: String(d.getDate()),
      monthName: getMonthNameShort(d),
      fullFormatted: getFullFormattedDate(d),
      isToday,
      isDisabled: false, // BUG 1 FIX: Today is selectable!
    };
  });

  // Default selected date is Today (index 0)
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].isoDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<AppointmentResponse | null>(null);
  const [inlineErrorMessage, setInlineErrorMessage] = useState<string | null>(null);

  // Fetch slot availability for ALL 7 days concurrently
  const dateQueries = useQueries({
    queries: availableDates.map((d) => ({
      queryKey: ["slot-availability", d.isoDate],
      queryFn: () => getSlotAvailability(d.isoDate),
      staleTime: 30000,
    })),
  });

  const selectedDateIndex = availableDates.findIndex((d) => d.isoDate === selectedDate);
  const activeDateQuery = dateQueries[selectedDateIndex >= 0 ? selectedDateIndex : 0];
  const slotData = activeDateQuery?.data || [];
  const isSlotsLoading = activeDateQuery?.isLoading;
  const isSlotsError = activeDateQuery?.isError;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  // Mutation for booking
  const bookMutation = useMutation({
    mutationFn: (values: BookingFormValues) =>
      bookAppointment({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        serviceName: values.serviceName || undefined,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot!,
        notes: values.notes || undefined,
      }),
    onSuccess: (data) => {
      setBookingSuccess(data);
      setInlineErrorMessage(null);
      reset(); // BUG 2 FIX: Reset React Hook Form fields on success
      toast.success(t("appointment.successTitle", "Appointment Confirmed!"));
      availableDates.forEach((d) => {
        queryClient.invalidateQueries({ queryKey: ["slot-availability", d.isoDate] });
      });
    },
    onError: (err: any) => {
      const responseData = err?.response?.data;
      let msg = "";

      if (responseData) {
        if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          msg = responseData.errors.join(". ");
        } else if (typeof responseData.message === "string" && responseData.message.trim().length > 0) {
          msg = responseData.message;
        }
      }

      if (!msg) {
        msg = getDiagnosticErrorMessage(err);
      }

      setInlineErrorMessage(msg);
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    setInlineErrorMessage(null);
    if (!selectedSlot) {
      toast.error("Please select a time slot first.");
      return;
    }
    bookMutation.mutate(values);
  };

  // BUG 2 FIX: Reset form completely when clicking "Book Another Appointment"
  const handleResetForm = () => {
    setBookingSuccess(null);
    setSelectedSlot(null);
    setSelectedDate(availableDates[0].isoDate); // Return to Step 1 on Today
    setInlineErrorMessage(null);
    reset(); // Clean reset of form fields
  };

  const formatTime12h = (time24h: string) => {
    if (!time24h) return "";
    const [h, m] = time24h.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  const selectedDateObj = availableDates.find((d) => d.isoDate === selectedDate);
  const isSelectedDateToday = selectedDateObj?.isToday || false;

  const morningSlots = slotData.filter((s) => {
    const h = parseInt(s.time.split(":")[0], 10);
    return h >= 7 && h < 12;
  });

  const afternoonSlots = slotData.filter((s) => {
    const h = parseInt(s.time.split(":")[0], 10);
    return h >= 12 && h < 18;
  });

  const eveningSlots = slotData.filter((s) => {
    const h = parseInt(s.time.split(":")[0], 10);
    return h >= 18 && h <= 23;
  });

  const selectedDateDetails = availableDates.find((d) => d.isoDate === selectedDate);

  const getDayTotalAvailable = (index: number) => {
    const dObj = availableDates[index];
    const query = dateQueries[index];
    if (query?.isLoading) return "Loading...";
    if (!query?.data) return "Available";

    if (dObj.isToday) {
      // Calculate active future slots for today in IST with 1h buffer
      const cutoffIST = new Date(todayIST.getTime() + 60 * 60 * 1000);
      const activeFutureSlots = query.data.filter((s) => {
        if (!s.time) return false;
        const [h, m] = s.time.split(":").map(Number);
        const slotD = new Date(todayIST);
        slotD.setHours(h, m, 0, 0);
        return slotD > cutoffIST;
      });
      const total = activeFutureSlots.reduce(
        (acc, s) => acc + (s.availableSlots ?? (s.isAvailable ? 4 - s.bookedSlots : 0)),
        0
      );
      return total > 0 ? `${total} slots` : "Full";
    }

    const total = query.data.reduce(
      (acc, s) => acc + (s.availableSlots ?? (s.isAvailable ? 4 - s.bookedSlots : 0)),
      0
    );
    return total > 0 ? `${total} slots` : "Full";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-50/50 min-h-screen">
      <SeoHead
        title="Book Appointment - Digi Seva Solution Jan Seva Kendra"
        description="Book your online appointment at Digi Seva Solution Jan Seva Kendra in New Ashok Nagar, Delhi. Select date and time slot for fast priority processing."
        path="/book-appointment"
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Official Jan Seva Kendra Appointment Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t("appointment.pageTitle", "Online Appointment Booking")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t(
            "appointment.pageSubtitle",
            "Schedule your visit to Digi Seva Solution Jan Seva Kendra in advance to skip waiting lines."
          )}
        </p>
      </div>

      {bookingSuccess ? (
        /* Confirmation Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-6 text-center max-w-2xl mx-auto"
        >
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              {t("appointment.successTitle", "Appointment Confirmed!")}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {t(
                "appointment.successDesc",
                "Your appointment has been successfully booked. Please check your email for complete details and guidelines."
              )}
            </p>
          </div>

          {/* Details Summary Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Booking Reference ID</span>
              <span className="font-extrabold text-slate-900 font-mono">#APP-{bookingSuccess.id}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Customer Name</span>
                <span className="font-bold text-slate-900">{bookingSuccess.name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Phone Number</span>
                <span className="font-bold text-slate-900 font-mono">{bookingSuccess.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Date & Time Slot</span>
                <span className="font-bold text-slate-900">
                  {bookingSuccess.appointmentDate} at {formatTime12h(bookingSuccess.appointmentTime)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Service Requested</span>
                <span className="font-bold text-slate-900">
                  {bookingSuccess.serviceName || "General Inquiry"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2 bg-orange-50/80 p-3 rounded-lg border border-orange-200/80">
              <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Jan Seva Kendra Center Location</span>
                <span>Block C/203, Masjid Wali Gali, Near Vivo Showroom, New Ashok Nagar, Delhi - 110096</span>
              </div>
            </div>
          </div>

          {bookingSuccess.email && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-lg">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Confirmation details dispatched to {bookingSuccess.email}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleResetForm}
              variant="outline"
              className="w-full sm:w-auto font-bold border-slate-300"
            >
              Book Another Appointment
            </Button>
            <WhatsAppButton
              variant="inline"
              label={t("whatsapp.shareAppointment", "Share Appointment Details")}
              message={`✅ Appointment Confirmed!\n📍 Digi Seva Solution - New Ashok Nagar, Delhi\n📅 Date: ${bookingSuccess.appointmentDate}\n⏰ Time: ${formatTime12h(bookingSuccess.appointmentTime)}\n🔧 Service: ${bookingSuccess.serviceName || "General Inquiry"}\n\nFor any changes, call: +91 7900867261\nWebsite: digisevasolution.online`}
              className="w-full sm:w-auto"
            />
            <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-bold">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Passport Seva Style Stepper Layout */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-8 space-y-8">
          {/* Top Step Progress Bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-slate-200 pb-5 text-xs">
            <div className={`flex items-center gap-2 font-bold ${selectedDate ? "text-accent-dark" : "text-slate-400"}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono ${selectedDate ? "bg-accent text-white" : "bg-slate-200 text-slate-600"}`}>
                1
              </span>
              <span>1. Select Date</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <div className={`flex items-center gap-2 font-bold ${selectedSlot ? "text-accent-dark" : selectedDate ? "text-slate-700" : "text-slate-400"}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono ${selectedSlot ? "bg-accent text-white" : selectedDate ? "bg-orange-100 text-accent-dark" : "bg-slate-200 text-slate-600"}`}>
                2
              </span>
              <span>2. Select Time Slot</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <div className={`flex items-center gap-2 font-bold ${selectedSlot ? "text-slate-900" : "text-slate-400"}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono ${selectedSlot ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                3
              </span>
              <span>3. Confirm Details</span>
            </div>
          </div>

          {/* Inline Error Notice */}
          {inlineErrorMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Booking Notice</span>
                <span>{inlineErrorMessage}</span>
              </div>
            </div>
          )}

          {/* STEP 1: Select Date */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-4.5 w-4.5 text-accent" />
                <span>Step 1: Select Appointment Date</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Next 7 Days Available</span>
            </div>

            {/* Date Selection Cards (BUG 1 FIX: Today is selectable) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {availableDates.map((item, index) => {
                const isSelected = selectedDate === item.isoDate;
                const slotSummary = getDayTotalAvailable(index);

                return (
                  <button
                    key={item.isoDate}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.isoDate);
                      setSelectedSlot(null);
                      setInlineErrorMessage(null);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[115px] relative ${
                      isSelected
                        ? "bg-[#0B2046] text-white border-orange-500 shadow-md ring-2 ring-orange-500/50 scale-[1.02]"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Today Badge */}
                    {item.isToday && (
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                          isSelected ? "bg-orange-500 text-white" : "bg-orange-100 text-accent-dark border border-orange-200"
                        }`}
                      >
                        Today
                      </span>
                    )}

                    <div className="space-y-0.5 pt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSelected ? "text-orange-400" : "text-slate-400"}`}>
                        {item.dayName}
                      </span>
                      <span className="text-2xl font-black font-mono leading-none block">{item.dayNumber}</span>
                      <span className={`text-[11px] font-semibold block ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {item.monthName}
                      </span>
                    </div>

                    {/* Slots summary tag */}
                    <div className="pt-2">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                          isSelected
                            ? "bg-white/20 text-orange-200"
                            : slotSummary === "Full"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {slotSummary}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Time Slot */}
          {selectedDate && (
            <div className="space-y-5 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-accent" />
                    <span>Step 2: Select Time Slot</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select an available slot for{" "}
                    <strong className="text-slate-900">{selectedDateDetails?.fullFormatted}</strong>
                  </p>
                </div>

                {/* Passport Portal Info Note */}
                <div className="flex items-center gap-1.5 text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-medium">
                  <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Max 4 customers per slot • Arrive 5-10 min early</span>
                </div>
              </div>

              {isSlotsLoading ? (
                <SkeletonLoader count={3} type="table" />
              ) : isSlotsError ? (
                <ErrorAlert message="Failed to load time slot availability. Please try refreshing." onRetry={() => activeDateQuery.refetch()} />
              ) : (
                <div className="space-y-6 bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                  {/* Morning Slots */}
                  {morningSlots.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          {t("appointment.morning", "Morning Slots (07:00 AM – 11:00 AM)")}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {morningSlots.map((slot) => (
                          <PassportSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedSlot === slot.time}
                            isToday={isSelectedDateToday}
                            nowIST={todayIST}
                            onSelect={() => {
                              setSelectedSlot(slot.time);
                              setInlineErrorMessage(null);
                            }}
                            formatTime={formatTime12h}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {afternoonSlots.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          {t("appointment.afternoon", "Afternoon Slots (12:00 PM – 05:00 PM)")}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {afternoonSlots.map((slot) => (
                          <PassportSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedSlot === slot.time}
                            isToday={isSelectedDateToday}
                            nowIST={todayIST}
                            onSelect={() => {
                              setSelectedSlot(slot.time);
                              setInlineErrorMessage(null);
                            }}
                            formatTime={formatTime12h}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evening Slots */}
                  {eveningSlots.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          {t("appointment.evening", "Evening Slots (06:00 PM – 11:00 PM)")}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {eveningSlots.map((slot) => (
                          <PassportSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedSlot === slot.time}
                            isToday={isSelectedDateToday}
                            nowIST={todayIST}
                            onSelect={() => {
                              setSelectedSlot(slot.time);
                              setInlineErrorMessage(null);
                            }}
                            formatTime={formatTime12h}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Details Form */}
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-slate-200"
            >
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-accent" />
                <span>Step 3: Enter Customer Details & Confirm</span>
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50/60 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t("appointment.name", "Full Name")} *</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("appointment.namePlaceholder", "Enter your full name")}
                      {...register("name")}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs text-slate-900 bg-white focus:outline-none transition-colors ${
                        errors.name ? "border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-accent"
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 font-semibold">{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t("appointment.phone", "Mobile Phone Number")} *</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder={t("appointment.phonePlaceholder", "10-digit mobile number")}
                      {...register("phone")}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs text-slate-900 bg-white focus:outline-none transition-colors font-mono ${
                        errors.phone ? "border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-accent"
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-500 font-semibold">{errors.phone.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{t("appointment.email", "Email Address")}</span>
                      </span>
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">For Confirmation Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder={t("appointment.emailPlaceholder", "your.email@example.com")}
                      {...register("email")}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs text-slate-900 bg-white focus:outline-none transition-colors ${
                        errors.email ? "border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-accent"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-500 font-semibold">{errors.email.message}</p>}
                  </div>

                  {/* Service Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t("appointment.service", "Service Interested In")}</span>
                    </label>
                    <select
                      {...register("serviceName")}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-accent"
                    >
                      <option value="">{t("appointment.servicePlaceholder", "Select a service (Optional)")}</option>
                      {(services || []).map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>{t("appointment.notes", "Additional Notes / Special Request")}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t("appointment.notesPlaceholder", "Any specific details or questions (Optional)")}
                    {...register("notes")}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-accent"
                  />
                  {errors.notes && <p className="text-[11px] text-rose-500 font-semibold">{errors.notes.message}</p>}
                </div>

                {/* Confirmation Box */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      Selected Appointment: <strong>{selectedDate}</strong> at <strong>{formatTime12h(selectedSlot)}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded font-mono uppercase">
                    SLOT RESERVED
                  </span>
                </div>

                <LoadingButton
                  type="submit"
                  isLoading={bookMutation.isPending}
                  loadingText={t("appointment.booking", "Booking Appointment...")}
                  className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-black text-sm rounded-xl shadow-md transition-colors"
                >
                  <span>{t("appointment.bookNow", "Confirm & Book Appointment")}</span>
                </LoadingButton>
              </form>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Passport Seva Style Time Slot Button Component with IST past-slot + 1-hour buffer calculation
 */
function PassportSlotButton({
  slot,
  isSelected,
  isToday,
  nowIST,
  onSelect,
  formatTime,
}: {
  slot: SlotAvailability;
  isSelected: boolean;
  isToday: boolean;
  nowIST: Date;
  onSelect: () => void;
  formatTime: (t: string) => string;
}) {
  const availableCount =
    slot.availableSlots !== undefined
      ? slot.availableSlots
      : (slot as unknown as { available?: boolean }).available || slot.isAvailable
      ? 4 - (slot.bookedSlots || 0)
      : 0;

  // BUG 1 FIX: Check if slot has passed or is within 1-hour buffer for today in IST
  let isPastOrBuffered = false;
  if (isToday && slot.time) {
    const [h, m] = slot.time.split(":").map(Number);
    const slotDateInIST = new Date(nowIST);
    slotDateInIST.setHours(h, m, 0, 0);

    const cutoffIST = new Date(nowIST.getTime() + 60 * 60 * 1000); // 1 hour buffer
    if (slotDateInIST <= cutoffIST) {
      isPastOrBuffered = true;
    }
  }

  const isFull = availableCount <= 0 || isPastOrBuffered;
  const isLimited = !isFull && (availableCount === 1 || availableCount === 2);

  return (
    <button
      type="button"
      disabled={isFull}
      onClick={onSelect}
      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 font-mono text-xs relative ${
        isFull
          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
          : isSelected
          ? "bg-[#0B2046] text-white border-orange-500 ring-2 ring-orange-500/80 shadow-md scale-[1.03]"
          : isLimited
          ? "bg-white text-slate-900 border-amber-300 hover:border-amber-400 hover:bg-amber-50/40 shadow-2xs"
          : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-2xs"
      }`}
    >
      <span className="font-extrabold text-sm">{formatTime(slot.time)}</span>
      <span
        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-tight ${
          isFull
            ? "bg-slate-200 text-slate-500"
            : isSelected
            ? "bg-orange-500 text-white"
            : isLimited
            ? "bg-amber-100 text-amber-900 border border-amber-300"
            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
        }`}
      >
        {isPastOrBuffered ? "Passed" : isFull ? "Full" : isLimited ? `${availableCount} Left` : `${availableCount} Available`}
      </span>
    </button>
  );
}

export default BookAppointmentPage;
