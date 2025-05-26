import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/api/task/api";

export const useGetAllTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAllTasks(),
  });
};

export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskApi.getTaskById({ urlParams: { id } }),
    enabled: !!id,
  });
};

export const useGetTaskByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["task-by-project-id", projectId],
    queryFn: () => taskApi.getTaskByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};

export const useGetTaskByUserStoryId = (userStoryId: string) => {
  return useQuery({
    queryKey: ["task-by-user-story-id", userStoryId],
    queryFn: () => taskApi.getTaskByUserStoryId({ urlParams: { userStoryId } }),
    enabled: !!userStoryId,
  });
};

export const useGetTaskByProjectIdAndUserStoryId = (
  projectId: string,
  userStoryId: string,
) => {
  return useQuery({
    queryKey: ["task-by-project-id-and-user-story-id", projectId, userStoryId],
    queryFn: () =>
      taskApi.getTaskByProjectIdAndUserStoryId({
        urlParams: { projectId, userStoryId },
      }),
    enabled: !!projectId && !!userStoryId,
  });
};

export const useGetTaskByRefWithProjectIdAndUserStoryId = (
  projectId: string,
  userStoryId: string,
  ref: string,
) => {
  return useQuery({
    queryKey: [
      "task-by-ref-with-project-id-and-user-story-id",
      projectId,
      userStoryId,
      ref,
    ],
    queryFn: () =>
      taskApi.getTaskByRefWithProjectIdAndUserStoryId({
        urlParams: { projectId, userStoryId, ref },
      }),
    enabled: !!projectId && !!userStoryId && !!ref,
  });
};
