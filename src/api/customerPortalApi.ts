import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  Customer,
  CustomerAppointment,
  CustomerEnquiry,
  CustomerDocumentStatusDto,
} from "@/types/customer.types";

export async function getCustomerProfile(): Promise<Customer> {
  const response = await apiClient.get<ApiResponse<Customer>>("/api/customer/profile");
  return response.data.data;
}

export async function updateCustomerProfile(data: {
  name: string;
  phone?: string;
}): Promise<Customer> {
  const response = await apiClient.put<ApiResponse<Customer>>("/api/customer/profile", data);
  return response.data.data;
}

export async function getCustomerAppointments(): Promise<CustomerAppointment[]> {
  const response = await apiClient.get<ApiResponse<CustomerAppointment[]>>(
    "/api/customer/appointments"
  );
  return response.data.data;
}

export async function getCustomerEnquiries(): Promise<CustomerEnquiry[]> {
  const response = await apiClient.get<ApiResponse<CustomerEnquiry[]>>("/api/customer/enquiries");
  return response.data.data;
}

export async function updateAdminAppointmentDocumentStatus(
  appointmentId: number,
  data: { checklistItemId: number; isReceived: boolean; notes?: string }
): Promise<CustomerDocumentStatusDto[]> {
  const response = await apiClient.put<ApiResponse<CustomerDocumentStatusDto[]>>(
    `/api/admin/appointments/${appointmentId}/documents`,
    data
  );
  return response.data.data;
}

export async function uploadCustomerProfilePhoto(file: File): Promise<Customer> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<ApiResponse<Customer>>(
    "/api/customer/profile/photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
}

export async function removeCustomerProfilePhoto(): Promise<Customer> {
  const response = await apiClient.delete<ApiResponse<Customer>>("/api/customer/profile/photo");
  return response.data.data;
}
