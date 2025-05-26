import { createApiRequest } from "../base/api-factory";
import type { TimelineEventProps } from "@/api/timeline/type";
import type { ResponseProps } from "../base/global-type";

const BASE_URL = `/timeline`;

export const timelineApi = {
  getTimelineByProjectId: createApiRequest<
    { urlParams: { projectId: string } },
    ResponseProps<TimelineEventProps[]>
  >({
    endpoint: `${BASE_URL}/project/{projectId}`,
    method: "GET",
    extraConfig: ({ urlParams }) => ({
      url: `${BASE_URL}/project/${urlParams?.projectId}`,
    }),
  }),
};
