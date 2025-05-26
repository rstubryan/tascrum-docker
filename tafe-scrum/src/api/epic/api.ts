import { createApiRequest } from "../base/api-factory";
import type { ResponseProps } from "../base/global-type";
import type { EpicProps, CreateEpicProps, EditEpicProps } from "./type";

const BASE_URL = `/epics`;

export const epicApi = {
  getAllEpics: createApiRequest<void, ResponseProps<EpicProps[]>>({
    endpoint: `${BASE_URL}`,
    method: "GET",
  }),

  getEpicById: createApiRequest<
    { urlParams: { id: string } },
    ResponseProps<EpicProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  getEpicByProjectId: createApiRequest<
    { urlParams: { projectId: string } },
    ResponseProps<EpicProps[]>
  >({
    endpoint: `${BASE_URL}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      params: {
        project: urlParams?.projectId,
      },
    }),
  }),

  getEpicByRefIdAndProjectId: createApiRequest<
    { urlParams: { refId: string; projectId: string } },
    EpicProps
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

  createEpic: createApiRequest<CreateEpicProps, ResponseProps<EpicProps>>({
    endpoint: `${BASE_URL}`,
    method: "POST",
  }),

  createRelatedUserStory: createApiRequest<
    {
      urlParams: { epicId: string };
      data: { user_story: string };
    },
    ResponseProps<EpicProps>
  >({
    endpoint: `${BASE_URL}/{epicId}/related_userstories`,
    method: "POST",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.epicId}/related_userstories`,
    }),
  }),

  updateEpic: createApiRequest<
    Partial<EditEpicProps>,
    ResponseProps<EpicProps>
  >({
    endpoint: `${BASE_URL}/{id}`,
    method: "PATCH",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.id}`,
    }),
  }),

  deleteEpic: createApiRequest<void, ResponseProps<null>>({
    endpoint: `${BASE_URL}/{id}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      params: {
        id: urlParams?.id,
      },
    }),
  }),

  deleteRelatedUserStory: createApiRequest<
    { urlParams: { epicId: string; userStoryId: string } },
    ResponseProps<null>
  >({
    endpoint: `${BASE_URL}/{epicId}/related_userstories/{userStoryId}`,
    method: "DELETE",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/${urlParams?.epicId}/related_userstories/${urlParams?.userStoryId}`,
    }),
  }),
};
