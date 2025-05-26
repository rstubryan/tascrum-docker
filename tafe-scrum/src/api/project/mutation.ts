import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { projectApi } from "@/api/project/api";
import { CreateProjectProps, EditProjectProps } from "@/api/project/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectProps) =>
      projectApi.createProject({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects-by-user"] });
      queryClient.invalidateQueries({ queryKey: ["projects-discover"] });
      toast.success("Project created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Project creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProjectProps) => {
      if (!data.id) {
        throw new Error("Project ID is required for project update");
      }

      return projectApi.updateProject({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects-by-user"] });
      queryClient.invalidateQueries({ queryKey: ["projects-discover"] });
      toast.success("Project updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Project update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string | number }) => {
      if (!data.id) {
        throw new Error("Project ID is required for project deletion");
      }

      return projectApi.deleteProject({
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects-by-user"] });
      queryClient.invalidateQueries({ queryKey: ["projects-discover"] });
      toast.success("Project deleted successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Project deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
