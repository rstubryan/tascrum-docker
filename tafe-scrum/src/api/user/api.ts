import { createApiRequest } from "../base/api-factory";
import {
  UserProps,
  EditUserProfileProps,
  ChangePasswordProps,
  DeleteUserAccountProps,
} from "./type";
import type { ResponseProps } from "../base/global-type";

const BASE_URL = `/users`;

export const userApi = {
  getAllUsers: createApiRequest<void, ResponseProps<UserProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  getUserAuth: createApiRequest<void, ResponseProps<UserProps>>({
    endpoint: `${BASE_URL}/me`,
    method: "GET",
  }),

  updateUserProfile: createApiRequest<
    EditUserProfileProps,
    ResponseProps<UserProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "PATCH",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),

  changeProfilePicture: createApiRequest<FormData, ResponseProps<UserProps>>({
    endpoint: `${BASE_URL}/change_avatar`,
    method: "POST",
  }),

  changePassword: createApiRequest<ChangePasswordProps, ResponseProps<null>>({
    endpoint: `${BASE_URL}/change_password`,
    method: "POST",
  }),

  deleteAccount: createApiRequest<DeleteUserAccountProps, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),
};
