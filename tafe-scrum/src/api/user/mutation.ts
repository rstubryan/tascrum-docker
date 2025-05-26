import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { userApi } from "@/api/user/api";
import { EditUserProfileProps, ChangePasswordProps } from "@/api/user/type";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { handleApiError } from "@/api/base/axios-error";

export const useEditUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditUserProfileProps) => {
      if (!data.id) {
        throw new Error("User ID is required for profile update");
      }

      return userApi.updateUserProfile({
        data,
        urlParams: {
          id: data.id,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-auth"] });
      toast.success("Profile updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Profile update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useChangeProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      userApi.changeProfilePicture({ data: formData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-auth"] });
      toast.success("Profile picture updated successfully");
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Profile picture update failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordProps) => userApi.changePassword({ data }),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Password change failed",
        "Please check your input and try again.",
      );
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) =>
      userApi.deleteAccount({
        urlParams: { id },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-auth"] });
      toast.success("Account deleted successfully");

      Cookies.remove("user_info", { path: "/" });
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("refresh", { path: "/refresh_token" });

      router.push("/login");
    },
    onError: (error: AxiosError) => {
      handleApiError(
        error,
        "Account deletion failed",
        "Please check your input and try again.",
      );
    },
  });
};
