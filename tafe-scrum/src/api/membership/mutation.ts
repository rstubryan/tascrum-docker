import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { membershipApi } from "@/api/membership/api";
import {
  CreateMembershipProps,
  EditMembershipProps,
} from "@/api/membership/type";
import { handleApiError } from "@/api/base/axios-error";

export const useCreateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMembershipProps) =>
      membershipApi.createMembership({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({ queryKey: ["project-by-slug"] });
      toast.success("Membership created successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Membership creation failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useEditMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditMembershipProps) => {
      if (!data.id) {
        throw new Error("Membership ID is required for membership update");
      }

      return membershipApi.updateMembership({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({ queryKey: ["project-by-slug"] });
      toast.success("Membership updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Membership update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!id) {
        throw new Error("Membership ID is required for membership deletion");
      }

      return membershipApi.deleteMembership({
        urlParams: {
          id,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({ queryKey: ["project-by-slug"] });
      toast.success("Membership deleted successfully");
    },

    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Membership deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
