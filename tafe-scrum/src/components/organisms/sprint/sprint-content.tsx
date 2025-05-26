"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CalendarDays, EyeIcon, Pencil, Trash2 } from "lucide-react";
import { Typography } from "@/components/atoms/typography/typography";
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
import { formatDate } from "@/utils";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetSprintByProjectId } from "@/api/sprint/queries";
import { useDeleteSprint } from "@/api/sprint/mutation";
import SprintDialog from "@/components/organisms/sprint/sprint-dialog";

export default function SprintContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useGetProjectBySlug(slug);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { mutate: deleteSprint } = useDeleteSprint();

  const { data: sprintsData, isLoading } = useGetSprintByProjectId(
    project?.id?.toString() || "",
  );

  // Ensure sprints is an array
  const sprints = Array.isArray(sprintsData) ? sprintsData : [];

  const totalPages = Math.ceil(sprints.length / itemsPerPage);
  const paginatedSprints = sprints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to first page when data changes
  useEffect(() => {
    if (sprintsData) {
      setCurrentPage(1);
    }
  }, [sprintsData]);

  const handleDeleteSprint = (sprintId: number | undefined) => {
    if (sprintId) {
      deleteSprint(sprintId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading sprints...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      {sprints.length === 0 ? (
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">
            No sprints found for this project
          </p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            Click the &#34;Create Sprint&#34; button to add your first sprint
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedSprints.map((sprint) => (
            <Card key={sprint.id} className="flex flex-col h-full">
              <CardHeader className="pb-0">
                <div className="xl:flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                      <Typography className="font-bold text-secondary">
                        #{sprint.id}
                      </Typography>
                    </div>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {sprint.name}
                      </CardTitle>
                      <CardContent className="p-0">
                        <Typography className="flex gap-1 text-xs text-muted-foreground">
                          <span className="font-medium">
                            {sprint.project_extra_info?.name}
                          </span>
                          <span>•</span>
                          <span
                            className={
                              sprint.closed ? "text-red-500" : "text-green-500"
                            }
                          >
                            {sprint.closed ? "Closed" : "Active"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="mb-2 grid grid-cols-1 gap-2 text-sm">
                    {/* Created Date */}
                    <div>
                      <span className="font-semibold">Created:</span>{" "}
                      {formatDate(sprint.created_date)}
                    </div>

                    {/* Sprint Period */}
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <Typography className="text-primary">
                        {formatDate(sprint.estimated_start)} -{" "}
                        {formatDate(sprint.estimated_finish)}
                      </Typography>
                    </div>

                    {/* User Stories Stats */}
                    <div className="mt-2">
                      <div className="bg-secondary p-2 rounded-md w-full">
                        <div className="text-center font-semibold text-primary">
                          {sprint.user_stories?.length || 0}
                        </div>
                        <div className="text-center text-xs text-primary">
                          User Stories
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2">
                  <Link
                    href={`/dashboard/projects/${slug}/sprints/${sprint.id}`}
                    className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                  >
                    <EyeIcon className="size-4 shrink-0" />
                    <span className="truncate">View Details</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <SprintDialog
                      mode="edit"
                      sprint={sprint}
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
                          <AlertDialogTitle>Delete Sprint</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-bold">
                              &#34;{sprint.name}&#34;
                            </span>
                            ? This action cannot be undone and will permanently
                            remove this sprint.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              sprint.id && handleDeleteSprint(sprint.id)
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
