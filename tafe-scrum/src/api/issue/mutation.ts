import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { issueApi } from "@/api/issue/api";
import { CreateIssueProps, EditIssueProps } from "@/api/issue/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssueProps) => issueApi.createIssue({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issue-by-project-id"] });
      toast.success("Issue created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Issue creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditIssueProps) => {
      if (!data.id) {
        throw new Error("Issue ID is required for issue update");
      }

      return issueApi.updateIssue({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issue-by-project-id"] });
      queryClient.invalidateQueries({
        queryKey: ["issue-by-ref-id-and-project-id"],
      });
      toast.success("Issue updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Issue update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!id) {
        throw new Error("Issue ID is required for issue deletion");
      }

      return issueApi.deleteIssue({
        urlParams: {
          id,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue-by-project-id"] });
      toast.success("Issue deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Issue deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
