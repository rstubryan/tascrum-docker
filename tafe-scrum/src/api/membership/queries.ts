import { useQuery } from "@tanstack/react-query";
import { membershipApi } from "@/api/membership/api";

export const useGetAllMemberships = () => {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: () => membershipApi.getAllMemberships(),
  });
};
