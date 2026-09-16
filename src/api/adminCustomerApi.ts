import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { CustomerAppointment, CustomerEnquiry, CustomerCallback } from "@/types/customer.types";

export interface CustomerAdmin {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  adminNote?: string;
  createdAt: string;
  lastActiveAt?: string;
  isLoggedIn?: boolean;
  appointmentCount: number;
  enquiryCount: number;
}

export interface CustomerDetailAdmin {
  profile: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
    createdAt: string;
  };
  appointments: CustomerAppointment[];
  enquiries: CustomerEnquiry[];
}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  activeThisWeek: number;
}

export async function getAdminCustomers(
  params?: {
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }
): Promise<PageResponse<CustomerAdmin>> {
  const response = await apiClient.get<ApiResponse<PageResponse<CustomerAdmin>>>(
    "/api/admin/customers",
    { params }
  );
  return response.data.data;
}

export async function getAdminCustomerById(id: number): Promise<CustomerDetailAdmin> {
  const response = await apiClient.get<ApiResponse<CustomerDetailAdmin>>(
    `/api/admin/customers/${id}`
  );
  return response.data.data;
}

export async function getAdminCustomerAppointments(id: number): Promise<CustomerAppointment[]> {
  const response = await apiClient.get<ApiResponse<CustomerAppointment[]>>(
    `/api/admin/customers/${id}/appointments`
  );
  return response.data.data;
}

export async function getAdminCustomerEnquiries(id: number): Promise<CustomerEnquiry[]> {
  const response = await apiClient.get<ApiResponse<CustomerEnquiry[]>>(
    `/api/admin/customers/${id}/enquiries`
  );
  return response.data.data;
}

export async function getAdminCustomerCallbacks(id: number): Promise<CustomerCallback[]> {
  const response = await apiClient.get<ApiResponse<CustomerCallback[]>>(
    `/api/admin/customers/${id}/callbacks`
  );
  return response.data.data;
}

export async function updateAdminCustomerNote(
  id: number,
  adminNote: string
): Promise<CustomerAdmin> {
  const response = await apiClient.patch<ApiResponse<CustomerAdmin>>(
    `/api/admin/customers/${id}/note`,
    { adminNote }
  );
  return response.data.data;
}

export async function updateAdminCustomer(
  id: number,
  data: { name: string; phone?: string }
): Promise<CustomerAdmin> {
  const response = await apiClient.put<ApiResponse<CustomerAdmin>>(
    `/api/admin/customers/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteAdminCustomer(id: number): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/api/admin/customers/${id}`);
}

export async function getAdminCustomerStats(): Promise<CustomerStats> {
  const response = await apiClient.get<ApiResponse<CustomerStats>>(
    "/api/admin/customers/stats"
  );
  return response.data.data;
}
