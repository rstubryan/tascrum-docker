import { useQuery } from "@tanstack/react-query";
import { sprintApi } from "@/api/sprint/api";

export const useGetAllSprints = () => {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: () => sprintApi.getAllSprints(),
  });
};

export const useGetSprintById = (id: string) => {
  return useQuery({
    queryKey: ["sprint", id],
    queryFn: () => sprintApi.getSprintById({ urlParams: { id } }),
    enabled: !!id,
  });
};

export const useGetSprintByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["sprint-by-project-id", projectId],
    queryFn: () => sprintApi.getSprintByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};
