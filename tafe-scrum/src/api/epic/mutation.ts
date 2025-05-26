import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { epicApi } from "@/api/epic/api";
import { CreateEpicProps, EditEpicProps } from "@/api/epic/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEpicProps) => epicApi.createEpic({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epic-by-project-id"] });
      toast.success("Epic created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Epic creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useCreateRelatedUserStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      epicId,
      userStoryId,
    }: {
      epicId: string;
      userStoryId: string;
    }) =>
      epicApi.createRelatedUserStory({
        urlParams: { epicId },
        data: {
          // @ts-expect-error The API expects both user_story and epic properties
          user_story: userStoryId,
          epic: epicId,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-epic"] });
      toast.success("User story related successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "User story relation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditEpicProps) => {
      if (!data.id) {
        throw new Error("Epic ID is required for epic update");
      }

      return epicApi.updateEpic({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epic-by-project-id"] });
      queryClient.invalidateQueries({
        queryKey: ["epic-by-ref-id-and-project-id"],
      });
      toast.success("Epic updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Epic update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      epicApi.deleteEpic({
        urlParams: {
          id,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epic-by-project-id"] });
      toast.success("Epic deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Epic deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteRelatedUserStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      epicId,
      userStoryId,
    }: {
      epicId: string;
      userStoryId: string;
    }) =>
      epicApi.deleteRelatedUserStory({
        urlParams: {
          epicId,
          userStoryId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories-by-epic"] });
      toast.success("User story removed from epic successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Failed to remove user story from epic",
        "Please check your input and try again.",
      );
    },
  });
};
