import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { userStoryApi } from "@/api/backlog-us/api";
import {
  CreateUserStoryProps,
  EditUserStoryProps,
} from "@/api/backlog-us/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateUserStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserStoryProps) =>
      userStoryApi.createUserStory({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-project"] });
      toast.success("User story created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "User story creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useAssociateUserStoriesToSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
      userStoryIds,
    }: {
      projectId: number;
      milestoneId: number;
      userStoryIds: number[];
    }) =>
      userStoryApi.createAssociateUserStoriesToSprint({
        data: {
          // @ts-expect-error The API expects both user_story and epic properties
          project_id: projectId,
          milestone_id: milestoneId,
          bulk_userstories: userStoryIds,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-project"] });
      queryClient.invalidateQueries({ queryKey: ["sprint"] });
      toast.success("User stories associated with sprint successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Failed to associate user stories with sprint",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditUserStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditUserStoryProps) => {
      if (!data.id) {
        throw new Error("User story ID is required for user story update");
      }

      return userStoryApi.updateUserStory({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-project"] });
      queryClient.invalidateQueries({
        queryKey: ["user-story-by-ref-and-project"],
      });
      toast.success("User story updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "User story update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteUserStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string | number }) => {
      if (!data.id) {
        throw new Error("User story ID is required for user story deletion");
      }

      return userStoryApi.deleteUserStory({
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-project"] });
      toast.success("User story deleted successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "User story deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteAssociateUserStoriesFromSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userStoryIds,
      beforeUserStoryId,
    }: {
      projectId: number;
      userStoryIds: number[];
      beforeUserStoryId?: number;
    }) =>
      userStoryApi.deleteAssociateUserStoriesFromSprint({
        data: {
          // @ts-expect-error The API expects both user_story and epic properties
          project_id: projectId,
          bulk_userstories: userStoryIds,
          before_userstory_id: beforeUserStoryId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-project"] });
      queryClient.invalidateQueries({ queryKey: ["sprint"] });
      toast.success("User stories removed from sprint successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Failed to remove user stories from sprint",
        "Please check your input and try again.",
      );
    },
  });
};
