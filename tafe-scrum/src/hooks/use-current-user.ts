import Cookies from "js-cookie";
import { useMemo } from "react";
import { UserProps } from "@/api/user/type";

export const useCurrentUser = () => {
  const userInfo = useMemo<UserProps | null>(() => {
    const userInfoString = Cookies.get("user_info");

    if (userInfoString) {
      try {
        return JSON.parse(userInfoString);
      } catch (error) {
        console.error("Error parsing user_info cookie:", error);
        return null;
      }
    }

    return null;
  }, []);

  return {
    userInfo,
    currentUserId: userInfo?.id ?? null,
    isAuthenticated: !!userInfo,
  };
};
