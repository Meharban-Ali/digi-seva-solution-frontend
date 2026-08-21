import { apiClient } from "@/lib/axios";
import { Project, ProjectRequest } from "@/types/project";
import { ApiResponse, PageResponse } from "@/types/api";

export const getPublicProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>("/api/projects");
  return response.data.data;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>("/api/projects/featured");
  return response.data.data;
};

export const getAdminProjects = async (page = 0, size = 20): Promise<PageResponse<Project>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Project>>>(
    `/api/admin/projects?page=${page}&size=${size}`
  );
  return response.data.data;
};

export const createProject = async (data: ProjectRequest): Promise<Project> => {
  const response = await apiClient.post<ApiResponse<Project>>("/api/admin/projects", data);
  return response.data.data;
};

export const updateProject = async (id: number, data: ProjectRequest): Promise<Project> => {
  const response = await apiClient.put<ApiResponse<Project>>(`/api/admin/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/admin/projects/${id}`);
};
