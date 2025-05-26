import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { taskApi } from "@/api/task/api";
import { CreateTaskProps, UpdateTaskProps } from "@/api/task/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskProps) => taskApi.createTask({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-by-project-id-and-user-story-id"],
      });
      queryClient.invalidateQueries({ queryKey: ["task-by-project-id"] });
      toast.success("Task created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Task creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskProps) => {
      if (!data.id) {
        throw new Error("Task ID is required for task update");
      }

      return taskApi.updateTask({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-by-project-id-and-user-story-id"],
      });
      queryClient.invalidateQueries({ queryKey: ["task-by-project-id"] });
      queryClient.invalidateQueries({
        queryKey: ["task-by-ref-with-project-id-and-user-story-id"],
      });
      toast.success("Task updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Task update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask({ urlParams: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-by-project-id-and-user-story-id"],
      });
      queryClient.invalidateQueries({ queryKey: ["task-by-project-id"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Task deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
