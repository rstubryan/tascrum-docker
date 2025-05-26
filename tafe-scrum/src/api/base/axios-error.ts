import { AxiosError } from "axios";
import { toast } from "sonner";
import type { ErrorResponse } from "@/api/base/global-type";

export const handleApiError = (
  error: AxiosError,
  defaultMessage: string,
  inputDescription: string = "Please check your input and try again.",
) => {
  if (error.response?.data) {
    const responseData = error.response.data as ErrorResponse;
    const errorMessage =
      responseData.detail ||
      responseData.error ||
      responseData.code ||
      defaultMessage;

    toast.error(errorMessage, {
      description: inputDescription,
    });
  } else if (error.request) {
    toast.error("Network error", {
      description: "Please check your connection.",
    });
  } else {
    toast.error(defaultMessage, {
      description: "Please try again later.",
    });
  }
};
