import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { TestimonialResponse, TestimonialRequest } from "@/types/testimonial.types";

export async function getPublicTestimonials(): Promise<TestimonialResponse[]> {
  const response = await apiClient.get<ApiResponse<TestimonialResponse[]>>("/api/testimonials");
  return response.data.data;
}

export async function getAdminTestimonials(
  page = 0,
  size = 10
): Promise<PageResponse<TestimonialResponse>> {
  const response = await apiClient.get<ApiResponse<PageResponse<TestimonialResponse>>>(
    "/api/admin/testimonials",
    { params: { page, size } }
  );
  return response.data.data;
}

export async function createTestimonial(data: TestimonialRequest): Promise<TestimonialResponse> {
  const response = await apiClient.post<ApiResponse<TestimonialResponse>>(
    "/api/admin/testimonials",
    data
  );
  return response.data.data;
}

export async function updateTestimonial(
  id: number,
  data: TestimonialRequest
): Promise<TestimonialResponse> {
  const response = await apiClient.put<ApiResponse<TestimonialResponse>>(
    `/api/admin/testimonials/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/testimonials/${id}`);
}

export async function publishTestimonial(id: number): Promise<TestimonialResponse> {
  const response = await apiClient.patch<ApiResponse<TestimonialResponse>>(
    `/api/admin/testimonials/${id}/publish`
  );
  return response.data.data;
}

export async function unpublishTestimonial(id: number): Promise<TestimonialResponse> {
  const response = await apiClient.patch<ApiResponse<TestimonialResponse>>(
    `/api/admin/testimonials/${id}/unpublish`
  );
  return response.data.data;
}
