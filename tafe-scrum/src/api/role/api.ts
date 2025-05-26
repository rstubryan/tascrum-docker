import { createApiRequest } from "../base/api-factory";
import type { RoleProps } from "./type";

const BASE_URL = `/roles`;

export const roleApi = {
  getAllRoles: createApiRequest<void, RoleProps[]>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),
};
