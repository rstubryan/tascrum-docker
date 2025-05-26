import { createApiRequest } from "../base/api-factory";
import type { ResponseProps } from "../base/global-type";
import type {
  MembershipProps,
  CreateMembershipProps,
  EditMembershipProps,
} from "./type";

const BASE_URL = `/memberships`;

export const membershipApi = {
  getAllMemberships: createApiRequest<void, ResponseProps<MembershipProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  createMembership: createApiRequest<
    CreateMembershipProps,
    ResponseProps<MembershipProps>
  >({
    endpoint: `${BASE_URL}`,
    method: "POST",
  }),

  updateMembership: createApiRequest<
    Partial<EditMembershipProps>,
    ResponseProps<MembershipProps>
  >({
    endpoint: `${BASE_URL}`,
    method: "PATCH",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  deleteMembership: createApiRequest<void, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),
};
