import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { sprintApi } from "@/api/sprint/api";
import { CreateSprintProps, EditSprintProps } from "@/api/sprint/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSprintProps) => sprintApi.createSprint({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint-by-project-id"] });
      toast.success("Sprint created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Sprint creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditSprintProps) => {
      if (!data.id) {
        throw new Error("Sprint ID is required for sprint update");
      }

      return sprintApi.updateSprint({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint-by-project-id"] });
      queryClient.invalidateQueries({ queryKey: ["sprint"] });
      toast.success("Sprint updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Sprint update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sprintApi.deleteSprint({ urlParams: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprint-by-project-id"] });
      toast.success("Sprint deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Sprint deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
