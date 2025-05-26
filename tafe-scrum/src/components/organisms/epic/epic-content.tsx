"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetEpicByProjectId } from "@/api/epic/queries";
import { useDeleteEpic, useEditEpic } from "@/api/epic/mutation";
import { formatDate } from "@/utils";
import EpicDialog from "@/components/organisms/epic/epic-dialog";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/avatar-initials";
import EpicStatusForm from "@/components/organisms/epic/form/epic-status-form";

export default function EpicContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get project data first to get the project ID
  const { data: project } = useGetProjectBySlug(slug);

  // Use the project ID to fetch epics
  const { data: epicsData, isLoading } = useGetEpicByProjectId(
    project?.id?.toString() || "",
  );
  const { mutate: deleteEpic } = useDeleteEpic();
  const { mutate: editEpic } = useEditEpic();

  const epics = Array.isArray(epicsData) ? epicsData : [];
  const totalPages = Math.ceil(epics.length / itemsPerPage);
  const paginatedEpics = epics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDeleteEpic = (epicId: number | undefined) => {
    if (epicId) {
      deleteEpic(epicId.toString(), {});
    }
  };

  const handleStatusChange = (
    epicId: number | undefined,
    newStatusValue: number,
  ) => {
    if (!epicId) return;

    const epic = epics.find((e) => e.id === epicId);
    if (!epic) return;

    editEpic({
      id: epicId,
      status: newStatusValue,
      version: epic.version,
      subject: epic.subject || "",
      project: epic.project || parseInt(project?.id?.toString() || "0"),
      assigned_to: epic.assigned_to,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading epics...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {epics.length === 0 ? (
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">
            No epics found for this project
          </p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            Click the &#34;Create Epic&#34; button to add your first epic
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedEpics.map((epic) => (
            <Card key={epic.id} className="flex flex-col h-full">
              <CardHeader className="pb-0">
                <div className="xl:flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md"
                      style={{
                        backgroundColor:
                          epic.status_extra_info?.color || "#70728F",
                      }}
                    >
                      <Typography className="font-bold text-white">
                        #{epic.ref}
                      </Typography>
                    </div>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {epic.subject}
                      </CardTitle>
                      <CardContent className="p-0">
                        <Typography className="flex gap-1 text-xs text-muted-foreground">
                          <span
                            style={{
                              color: epic.status_extra_info?.color || "#70728F",
                            }}
                          >
                            {epic.status_extra_info?.name || "New"}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {epic.is_closed ? "Closed" : "Open"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>

                  <EpicStatusForm
                    className={"mt-4 xl:mt-0 xl:w-[150px] w-full"}
                    epics={epics}
                    epicStatus={epic.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(epic.id, newStatus)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="mb-2 grid grid-cols-1 gap-1 text-sm">
                    {epic.owner_extra_info && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-full">
                          <AvatarImage
                            src={epic.owner_extra_info.photo}
                            alt={epic.owner_extra_info.full_name_display}
                          />
                          <AvatarFallback>
                            {getInitials(
                              epic.owner_extra_info.full_name_display,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <Typography size="xs" className="text-primary">
                          by {epic.owner_extra_info.full_name_display}
                        </Typography>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Created:</span>{" "}
                      {epic.created_date
                        ? formatDate(epic.created_date)
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Assigned To:</span>{" "}
                      {epic.assigned_to_extra_info?.full_name_display || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">User Stories:</span>{" "}
                      {epic.user_stories_counts?.total || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2">
                  <Link
                    href={`/dashboard/projects/${slug}/epics/${epic.ref}`}
                    className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                  >
                    <EyeIcon className="size-4 shrink-0" />
                    <span className="truncate">View Details</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <EpicDialog
                      mode="edit"
                      epic={epic}
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
                          <AlertDialogTitle>Delete Epic</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-bold">
                              &#34;{epic.subject}&#34;
                            </span>
                            ? This action cannot be undone and will permanently
                            remove this epic.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => epic.id && handleDeleteEpic(epic.id)}
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
