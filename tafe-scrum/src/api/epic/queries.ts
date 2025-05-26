import { useQuery } from "@tanstack/react-query";
import { epicApi } from "@/api/epic/api";

export const useGetAllEpics = () => {
  return useQuery({
    queryKey: ["epics"],
    queryFn: () => epicApi.getAllEpics(),
  });
};

export const useGetEpicById = (id: string) => {
  return useQuery({
    queryKey: ["epic", id],
    queryFn: () => epicApi.getEpicById({ urlParams: { id } }),
    enabled: !!id,
  });
};

export const useGetEpicByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["epic-by-project-id", projectId],
    queryFn: () => epicApi.getEpicByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};

export const useGetEpicByRefIdAndProjectId = (
  refId: string,
  projectId: string,
) => {
  return useQuery({
    queryKey: ["epic-by-ref-id-and-project-id", refId, projectId],
    queryFn: () =>
      epicApi.getEpicByRefIdAndProjectId({
        urlParams: { refId, projectId },
      }),
    enabled: !!refId && !!projectId,
  });
};
