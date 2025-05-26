import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/api";
import Cookies from "js-cookie";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getAllUsers(),
  });
};

export const useGetUserAuth = () => {
  const authToken = Cookies.get("auth_token");

  return useQuery({
    queryKey: ["user-auth", authToken],
    queryFn: () => userApi.getUserAuth(),
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
  });
};
