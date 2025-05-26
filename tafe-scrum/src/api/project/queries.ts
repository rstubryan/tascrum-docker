import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/api/project/api";

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAllProjects(),
  });
};

export const useGetProjectBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["project-by-slug", slug],
    queryFn: () => projectApi.getProjectBySlug({ urlParams: { slug } }),
  });
};

export const useGetProjectsByUser = (
  memberId: string,
  options?: {
    enabled?: boolean;
    retry?: number;
    retryDelay?: number;
  },
) => {
  return useQuery({
    queryKey: ["projects-by-user", memberId],
    queryFn: () => projectApi.getProjectsByUser({ urlParams: { memberId } }),
    enabled: options?.enabled,
    retry: options?.retry,
    retryDelay: options?.retryDelay,
  });
};

export const useGetProjectDiscover = () => {
  return useQuery({
    queryKey: ["projects-discover"],
    queryFn: () => projectApi.getProjectDiscover(),
  });
};
