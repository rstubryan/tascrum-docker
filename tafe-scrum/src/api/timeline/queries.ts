import { useQuery } from "@tanstack/react-query";
import { timelineApi } from "@/api/timeline/api";

export const useGetTimelineByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["timeline", projectId],
    queryFn: () =>
      timelineApi.getTimelineByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};
