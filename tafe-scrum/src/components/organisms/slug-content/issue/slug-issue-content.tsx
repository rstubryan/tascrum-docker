"use client";

import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import {
  useGetIssueByProjectId,
  useGetIssueByRefIdAndProjectId,
} from "@/api/issue/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { formatDate } from "@/utils";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import IssueStatusForm from "@/components/organisms/issue/form/issue-status-form";
import { useEditIssue } from "@/api/issue/mutation";
import IssueForm from "@/components/organisms/issue/form/issue-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function SlugIssueContent() {
  const params = useParams();
  const slug = params.slug as string;
  const ref = params.id as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: project } = useGetProjectBySlug(slug);
  const projectId = project?.id?.toString() || "";

  // Step 1: Get all issues for the project
  const { data: issuesResponse, isLoading: isLoadingIssues } =
    useGetIssueByProjectId(projectId);

  // Step 2: Find the specific issue by ref
  const issues = Array.isArray(issuesResponse) ? issuesResponse : [];
  const issuePreview = issues.find((i) => i.ref?.toString() === ref);

  // Step 3: Get detailed issue info
  const { data: issueDetail, isLoading: isLoadingDetail } =
    useGetIssueByRefIdAndProjectId(ref, projectId);

  const { mutate: editIssue } = useEditIssue();

  // Use the detailed issue if available, otherwise use the preview
  const issue = issueDetail || issuePreview || null;
  const isLoading = isLoadingIssues || isLoadingDetail;

  const handleStatusChange = (newStatusValue: number) => {
    if (!issue || !issue.id) return;

    editIssue({
      id: issue.id,
      status: newStatusValue,
      project: issue.project || parseInt(projectId),
      subject: issue.subject || "",
      version: issue.version,
      type: issue.type,
      severity: issue.severity,
      priority: issue.priority,
    });
  };

  const handleEditSuccess = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading issue details...</Typography>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col gap-4 mt-5">
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">Issue not found</p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            The requested issue could not be found or you may not have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-md"
            style={{
              backgroundColor: issue.status_extra_info?.color || "#70728F",
            }}
          >
            <Typography className="font-bold text-white">
              #{issue.ref}
            </Typography>
          </div>
          <div>
            <Typography size="h3">{issue.subject}</Typography>
            <div className="flex items-center gap-1">
              <span
                style={{
                  color: issue.status_extra_info?.color || "#70728F",
                }}
                className="font-medium"
              >
                {issue.status_extra_info?.name || "New"}
              </span>
              <span>•</span>
              <span className="font-medium">
                {issue.is_closed ? "Closed" : "Open"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="inline-flex items-center justify-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Issue</DialogTitle>
              </DialogHeader>
              <IssueForm
                mode="edit"
                issue={issue}
                onSuccess={handleEditSuccess}
              />
            </DialogContent>
          </Dialog>
          <IssueStatusForm
            issues={[issue]}
            issueStatus={issue.status}
            onStatusChange={handleStatusChange}
            className="w-full lg:w-[200px]"
          />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Typography className="font-semibold">Created Date</Typography>
              <Typography>
                {issue.created_date ? formatDate(issue.created_date) : "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Modified Date</Typography>
              <Typography>
                {issue.modified_date ? formatDate(issue.modified_date) : "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Due Date</Typography>
              <Typography>
                {issue.due_date ? formatDate(issue.due_date) : "Not set"}
              </Typography>
            </div>
            {/*<div>*/}
            {/*  <Typography className="font-semibold">Type</Typography>*/}
            {/*  <Typography>{issue.type_extra_info?.name || "Bug"}</Typography>*/}
            {/*</div>*/}
          </div>

          <div className="space-y-4">
            <div>
              <Typography className="font-semibold">Owner</Typography>
              <Typography>
                {issue.owner_extra_info?.full_name_display || "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Assigned To</Typography>
              <Typography>
                {issue.assigned_to_extra_info?.full_name_display ||
                  "Unassigned"}
              </Typography>
            </div>
            {/*<div>*/}
            {/*  <Typography className="font-semibold">Priority</Typography>*/}
            {/*  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">*/}
            {/*    {issue.priority_extra_info?.name || "Normal"}*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <Typography className="font-semibold">Severity</Typography>*/}
            {/*  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">*/}
            {/*    {issue.severity_extra_info?.name || "Normal"}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </CardContent>
      </Card>

      {issue.description_html && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: issue.description_html }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
