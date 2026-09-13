import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  SlotAvailability,
  BookAppointmentRequest,
  AppointmentResponse,
  UpdateAppointmentStatusDto,
} from "@/types/appointment.types";

export async function getSlotAvailability(date?: string): Promise<SlotAvailability[]> {
  const params: Record<string, unknown> = {};
  if (date) params.date = date;
  const response = await apiClient.get<ApiResponse<SlotAvailability[]>>("/api/appointments/slots", { params });
  return response.data.data;
}

export async function bookAppointment(data: BookAppointmentRequest): Promise<AppointmentResponse> {
  const response = await apiClient.post<ApiResponse<AppointmentResponse>>("/api/appointments", data);
  return response.data.data;
}

export async function getAdminAppointments(
  status?: string,
  page = 0,
  size = 20
): Promise<PageResponse<AppointmentResponse>> {
  const params: Record<string, unknown> = { page, size };
  if (status && status !== "ALL") params.status = status;
  const response = await apiClient.get<ApiResponse<PageResponse<AppointmentResponse>>>(
    "/api/admin/appointments",
    { params }
  );
  return response.data.data;
}

export async function getAdminTodayAppointments(): Promise<AppointmentResponse[]> {
  const response = await apiClient.get<ApiResponse<AppointmentResponse[]>>("/api/admin/appointments/today");
  return response.data.data;
}

export async function updateAdminAppointmentStatus(
  id: number,
  status: UpdateAppointmentStatusDto["status"]
): Promise<AppointmentResponse> {
  const response = await apiClient.patch<ApiResponse<AppointmentResponse>>(
    `/api/admin/appointments/${id}/status`,
    { status }
  );
  return response.data.data;
}
