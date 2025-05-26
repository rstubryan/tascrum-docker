"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import { useGetIssueByProjectId } from "@/api/issue/queries";
import { useDeleteIssue } from "@/api/issue/mutation";
import { Typography } from "@/components/atoms/typography/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import { formatDate, getInitials } from "@/utils";
import { useGetProjectBySlug } from "@/api/project/queries";
import IssueDialog from "@/components/organisms/issue/issue-dialog";
import IssueStatusFilter from "@/components/organisms/issue/issue-status-filter";
import { createPortal } from "react-dom";
import IssueStatusForm from "@/components/organisms/issue/form/issue-status-form";
import { useEditIssue } from "@/api/issue/mutation";

interface IssueContentProps {
  filterContainerId?: string;
}

export default function IssueContent({ filterContainerId }: IssueContentProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useGetProjectBySlug(slug);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filterContainer, setFilterContainer] = useState<HTMLElement | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 9;
  const { mutate: editIssue } = useEditIssue();
  const { mutate: deleteIssue } = useDeleteIssue();

  const { data: issuesData, isLoading } = useGetIssueByProjectId(
    project?.id?.toString() || "",
  );

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find the filter container after component mounts
  useEffect(() => {
    if (filterContainerId && isMounted) {
      const container = document.getElementById(filterContainerId);
      setFilterContainer(container);
    }
  }, [filterContainerId, isMounted]);

  // Ensure issues is an array
  const issues = Array.isArray(issuesData) ? issuesData : [];

  // Filter issues by selected status
  const filteredIssues = selectedStatus
    ? issues.filter((issue) => issue.status?.toString() === selectedStatus)
    : issues;

  const issueCount = filteredIssues.length;

  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(issueCount / itemsPerPage);

  useEffect(() => {
    if (issuesData) {
      setCurrentPage(1);
    }
  }, [issuesData, selectedStatus]);

  const handleStatusFilterChange = (statusValue: string | null) => {
    setSelectedStatus(statusValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusChange = (
    issueId: number | undefined,
    newStatusValue: number,
  ) => {
    if (!issueId) return;

    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return;

    editIssue({
      id: issueId,
      status: newStatusValue,
      version: issue.version,
      subject: issue.subject || "",
      project: issue.project || parseInt(project?.id?.toString() || "0"),
      assigned_to: issue.assigned_to,
    });
  };

  const handleDeleteIssue = (issueId: number | undefined) => {
    if (issueId) {
      deleteIssue(issueId.toString(), {});
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading issues...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      {!filterContainerId && (
        <div className="flex justify-end">
          <IssueStatusFilter
            issues={issues}
            selectedStatus={selectedStatus}
            onStatusFilterChange={handleStatusFilterChange}
            className="w-[220px]"
          />
        </div>
      )}

      {isMounted &&
        filterContainer &&
        createPortal(
          <IssueStatusFilter
            issues={issues}
            selectedStatus={selectedStatus}
            onStatusFilterChange={handleStatusFilterChange}
            className="w-full"
          />,
          filterContainer,
        )}

      {filteredIssues.length === 0 ? (
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">
            {issues.length === 0
              ? "No issues found for this project"
              : "No issues match the selected filter"}
          </p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            {issues.length === 0
              ? 'Click the "Create Issue" button to add your first issue'
              : "Try changing the filter or view all issues"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedIssues.map((issue) => (
            <Card key={issue.id} className="flex flex-col h-full">
              <CardHeader className="pb-0">
                <div className="xl:flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md"
                      style={{
                        backgroundColor:
                          issue.status_extra_info?.color || "#70728F",
                      }}
                    >
                      <Typography className="font-bold text-white">
                        #{issue.ref}
                      </Typography>
                    </div>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {issue.subject}
                      </CardTitle>
                      <CardContent className="p-0">
                        <Typography className="flex gap-1 text-xs text-muted-foreground">
                          <span
                            style={{
                              color:
                                issue.status_extra_info?.color || "#70728F",
                            }}
                          >
                            {issue.status_extra_info?.name || "New"}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {issue.is_closed ? "Closed" : "Open"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>

                  <IssueStatusForm
                    className={"mt-4 xl:mt-0 xl:w-[150px] w-full"}
                    issues={issues}
                    issueStatus={issue.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(issue.id, newStatus)
                    }
                  />
                </div>
              </CardHeader>{" "}
              <CardContent className="flex-1">
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="mb-2 grid grid-cols-1 gap-2 text-sm">
                    {/* Owner Info */}
                    {issue.owner_extra_info && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-full">
                          <AvatarImage
                            src={issue.owner_extra_info.photo}
                            alt={issue.owner_extra_info.full_name_display}
                          />
                          <AvatarFallback>
                            {getInitials(
                              issue.owner_extra_info.full_name_display,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <Typography size="xs" className="text-primary">
                          by {issue.owner_extra_info.full_name_display}
                        </Typography>
                      </div>
                    )}

                    {/* Assigned To */}
                    <div>
                      <span className="font-semibold">Assigned To:</span>{" "}
                      {issue.assigned_to_extra_info?.full_name_display || "N/A"}
                    </div>

                    {/* Dates with bullet separators */}
                    <div className="flex items-center gap-2 text-xs">
                      <span>
                        Created:{" "}
                        {issue.created_date
                          ? formatDate(issue.created_date)
                          : "N/A"}
                      </span>
                      <span>•</span>
                      <span>
                        Modified:{" "}
                        {issue.modified_date
                          ? formatDate(issue.modified_date)
                          : "N/A"}
                      </span>
                      <span>•</span>
                      <span>
                        Due:{" "}
                        {issue.due_date
                          ? formatDate(issue.due_date)
                          : "Not available"}
                      </span>
                    </div>

                    {/*/!* Type, Priority, Severity - Flex Layout *!/*/}
                    {/*<div className="flex flex-wrap gap-x-4 gap-y-1">*/}
                    {/*  <div className="min-w-[25%]">*/}
                    {/*    <span className="font-semibold">Type:</span>{" "}*/}
                    {/*    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">*/}
                    {/*      {issue.type || "N/A"}*/}
                    {/*    </span>*/}
                    {/*  </div>*/}
                    {/*  <div className="min-w-[30%]">*/}
                    {/*    <span className="font-semibold">Priority:</span>{" "}*/}
                    {/*    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">*/}
                    {/*      {issue.priority || "N/A"}*/}
                    {/*    </span>*/}
                    {/*  </div>*/}
                    {/*  <div>*/}
                    {/*    <span className="font-semibold">Severity:</span>{" "}*/}
                    {/*    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">*/}
                    {/*      {issue.severity || "N/A"}*/}
                    {/*    </span>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2">
                  <Link
                    href={`/dashboard/projects/${slug}/issues/${issue.ref}`}
                    className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                  >
                    <EyeIcon className="size-4 shrink-0" />
                    <span className="truncate">View Details</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <IssueDialog
                      mode="edit"
                      issue={issue}
                      trigger={
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-full"
                        >
                          <span className="sr-only">Edit</span>
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-full"
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-bold">
                              &#34;{issue.subject}&#34;
                            </span>
                            ? This action cannot be undone and will permanently
                            remove this issue.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              issue.id && handleDeleteIssue(issue.id)
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4">
          <PaginationLayout
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
