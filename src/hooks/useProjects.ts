import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicProjects,
  getFeaturedProjects,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../features/projects/projectsApi";
import { ProjectRequest } from "../types/project";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects", "public"],
    queryFn: getPublicProjects,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ["projects", "featured"],
    queryFn: getFeaturedProjects,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminProjects = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ["projects", "admin", page, size],
    queryFn: () => getAdminProjects(page, size),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectRequest }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
