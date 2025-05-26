import { createApiRequest } from "../base/api-factory";
import type { ResponseProps } from "../base/global-type";
import type { IssueProps, CreateIssueProps, EditIssueProps } from "./type";

const BASE_URL = `/issues`;

export const issueApi = {
  getAllIssues: createApiRequest<void, ResponseProps<IssueProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  getIssueById: createApiRequest<
    { urlParams: { id: string } },
    ResponseProps<IssueProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  getIssueByProjectId: createApiRequest<
    { urlParams: { projectId: string } },
    ResponseProps<IssueProps[]>
  >({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        project_id: urlParams?.projectId,
      },
    }),
  }),

  getIssueByRefIdAndProjectId: createApiRequest<
    { urlParams: { refId: string; projectId: string } },
    ResponseProps<IssueProps>
  >({
    endpoint: `${BASE_URL}/by_ref`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        ref: urlParams?.refId,
        project: urlParams?.projectId,
      },
    }),
  }),

  createIssue: createApiRequest<CreateIssueProps, ResponseProps<IssueProps>>({
    endpoint: `${BASE_URL}`,
    method: "POST",
  }),

  updateIssue: createApiRequest<
    Partial<EditIssueProps>,
    ResponseProps<IssueProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "PATCH",
  }),

  deleteIssue: createApiRequest<void, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),
};
