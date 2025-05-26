import { useQuery } from "@tanstack/react-query";
import { roleApi } from "@/api/role/api";

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleApi.getAllRoles(),
  });
};
