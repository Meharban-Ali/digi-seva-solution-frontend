export interface SlotAvailability {
  date: string;
  time: string;
  bookedSlots: number;
  availableSlots: number;
  isAvailable: boolean;
}

export interface BookAppointmentRequest {
  name: string;
  phone: string;
  email?: string;
  serviceName?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceName?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  confirmationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAppointmentStatusDto {
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}
