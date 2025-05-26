import { createApiRequest } from "../base/api-factory";
import type {
  ProjectProps,
  CreateProjectProps,
  EditProjectProps,
} from "./type";
import type { ResponseProps } from "../base/global-type";

const BASE_URL = `/projects`;

export const projectApi = {
  getAllProjects: createApiRequest<void, ResponseProps<ProjectProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  getProjectDiscover: createApiRequest<void, ResponseProps<ProjectProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: () => ({
      params: {
        discover_mode: true,
      },
    }),
  }),

  getProjectsByUser: createApiRequest<
    { urlParams: { memberId: string } },
    ResponseProps<ProjectProps[]>
  >({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        member: urlParams?.memberId,
      },
    }),
  }),

  getProjectBySlug: createApiRequest<
    { urlParams: { slug: string } },
    ProjectProps
  >({
    endpoint: `${BASE_URL}/by_slug`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        slug: urlParams?.slug,
      },
    }),
  }),

  getProjectById: createApiRequest<
    { urlParams: { id: string } },
    ResponseProps<ProjectProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  createProject: createApiRequest<
    CreateProjectProps,
    ResponseProps<ProjectProps>
  >({
    endpoint: `${BASE_URL}`,
    method: "POST",
  }),

  updateProject: createApiRequest<
    Partial<EditProjectProps>,
    ResponseProps<ProjectProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "PATCH",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),

  deleteProject: createApiRequest<void, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),
};
