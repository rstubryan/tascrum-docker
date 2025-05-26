import { useQuery } from "@tanstack/react-query";
import { userStoryApi } from "@/api/backlog-us/api";

export const useGetAllUserStories = () => {
  return useQuery({
    queryKey: ["user-stories"],
    queryFn: () => userStoryApi.getAllUserStories(),
  });
};

export const useGetUserStoryById = (id: string) => {
  return useQuery({
    queryKey: ["user-story", id],
    queryFn: () => userStoryApi.getUserStoryById({ urlParams: { id } }),
    enabled: !!id,
  });
};

export const useGetUserStoryByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["user-stories-by-project", projectId],
    queryFn: () =>
      userStoryApi.getUserStoryByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};

export const useGetUserStoryByRefAndProjectId = (
  ref: string,
  projectId: string,
) => {
  return useQuery({
    queryKey: ["user-story-by-ref-and-project", ref, projectId],
    queryFn: () =>
      userStoryApi.getUserStoryByRefAndProjectId({
        urlParams: { ref, projectId },
      }),
    enabled: !!ref && !!projectId,
  });
};

export const useGetUserStoryByEpicId = (epicId: string) => {
  return useQuery({
    queryKey: ["user-stories-by-epic", epicId],
    queryFn: () => userStoryApi.getUserStoryByEpicId({ urlParams: { epicId } }),
    enabled: !!epicId,
  });
};
