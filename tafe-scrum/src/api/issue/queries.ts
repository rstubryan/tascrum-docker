import { useQuery } from "@tanstack/react-query";
import { issueApi } from "@/api/issue/api";

export const useGetAllIssues = () => {
  return useQuery({
    queryKey: ["issues"],
    queryFn: () => issueApi.getAllIssues(),
  });
};

export const useGetIssueById = (id: string) => {
  return useQuery({
    queryKey: ["issue", id],
    queryFn: () => issueApi.getIssueById({ urlParams: { id } }),
    enabled: !!id,
  });
};

export const useGetIssueByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["issue-by-project-id", projectId],
    queryFn: () => issueApi.getIssueByProjectId({ urlParams: { projectId } }),
    enabled: !!projectId,
  });
};

export const useGetIssueByRefIdAndProjectId = (
  refId: string,
  projectId: string,
) => {
  return useQuery({
    queryKey: ["issue-by-ref-id-and-project-id", refId, projectId],
    queryFn: () =>
      issueApi.getIssueByRefIdAndProjectId({
        urlParams: { refId, projectId },
      }),
    enabled: !!refId && !!projectId,
  });
};
