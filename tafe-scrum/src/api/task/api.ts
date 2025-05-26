import { createApiRequest } from "../base/api-factory";
import type { TaskProps, CreateTaskProps, UpdateTaskProps } from "./type";
import type { ResponseProps } from "../base/global-type";

const BASE_URL = `/tasks`;

export const taskApi = {
  getAllTasks: createApiRequest<void, ResponseProps<TaskProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  getTaskById: createApiRequest<{ urlParams: { id: string } }, TaskProps>({
    endpoint: `${BASE_URL}/{id}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  getTaskByProjectId: createApiRequest<
    { urlParams: { projectId: string } },
    ResponseProps<TaskProps[]>
  >({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        project: urlParams?.projectId,
      },
    }),
  }),

  getTaskByUserStoryId: createApiRequest<
    { urlParams: { userStoryId: string } },
    ResponseProps<TaskProps[]>
  >({
    endpoint: `${BASE_URL}/{userStoryId}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        user_story: urlParams?.userStoryId,
      },
    }),
  }),

  getTaskByProjectIdAndUserStoryId: createApiRequest<
    { urlParams: { projectId: string; userStoryId: string } },
    ResponseProps<TaskProps[]>
  >({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        project: urlParams?.projectId,
        user_story: urlParams?.userStoryId,
        order_by: "us_order",
      },
    }),
  }),

  getTaskByRefWithProjectIdAndUserStoryId: createApiRequest<
    { urlParams: { projectId: string; userStoryId: string; ref: string } },
    ResponseProps<TaskProps>
  >({
    endpoint: `${BASE_URL}/by_ref`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        project: urlParams?.projectId,
        user_story: urlParams?.userStoryId,
        ref: urlParams?.ref,
      },
    }),
  }),

  createTask: createApiRequest<CreateTaskProps, ResponseProps<TaskProps>>({
    endpoint: `${BASE_URL}`,
    method: "POST",
  }),

  updateTask: createApiRequest<
    Partial<UpdateTaskProps>,
    ResponseProps<TaskProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "PATCH",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),

  deleteTask: createApiRequest<void, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),
};
