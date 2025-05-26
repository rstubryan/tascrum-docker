"use client";

import { useState } from "react";
import { LoaderCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { ProjectProps } from "@/api/project/type";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import { useGetProjectDiscover } from "@/api/project/queries";
import { useDeleteProject } from "@/api/project/mutation";
import ProjectDialog from "@/components/organisms/project/project-dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/utils/avatar-initials";
import { formatDate } from "@/utils";
import Link from "next/link";
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
import { Typography } from "@/components/atoms/typography/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DiscoverTab() {
  const { data: discoverProjects, isLoading: isLoadingDiscoverProjects } =
    useGetProjectDiscover();
  const { mutate: deleteProject } = useDeleteProject();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { currentUserId } = useCurrentUser();

  const totalProjects = Array.isArray(discoverProjects)
    ? discoverProjects.length
    : 0;
  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const getPaginatedProjects = () => {
    if (!Array.isArray(discoverProjects)) return [];

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return discoverProjects.slice(startIdx, endIdx);
  };

  const paginatedProjects = getPaginatedProjects();

  const canViewProject = (project: ProjectProps) => {
    if (!currentUserId) return false;
    // Check if user is a member, owner or admin
    const isMember = project.i_am_member === true;
    const isOwner =
      project.owner?.id === currentUserId || project.i_am_owner === true;
    const isAdmin = project.i_am_admin === true;

    return isMember || isOwner || isAdmin;
  };

  const canEditProject = (project: ProjectProps) => {
    if (!currentUserId) return false;
    const isOwner =
      project.owner?.id === currentUserId || project.i_am_owner === true;
    const isAdmin = project.i_am_admin === true;

    return isOwner || isAdmin;
  };

  const handleDeleteProject = (projectId: number | string) => {
    if (projectId) {
      deleteProject({ id: projectId });
    }
  };

  if (isLoadingDiscoverProjects) {
    return (
      <div className="flex justify-center py-8">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!Array.isArray(discoverProjects) || discoverProjects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Typography>No projects available to discover.</Typography>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-3">
        {paginatedProjects.map((project: ProjectProps) => (
          <Card key={project.id} className="flex h-full flex-col">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div className="relative flex size-10 shrink-0 overflow-hidden h-10 w-10 rounded-md">
                  <span className="flex h-full w-full items-center justify-center rounded-md bg-primary/10 font-bold text-primary">
                    {getInitials(
                      project.owner?.full_name_display ||
                        project.owner?.username,
                    )}
                  </span>
                </div>
                <div>
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <CardDescription className="flex gap-1">
                    {project.is_private && (
                      <span className="text-amber-500">Private</span>
                    )}
                    {project.is_private && <span>•</span>}
                    <span className="font-medium">
                      {project.i_am_owner
                        ? "Owner"
                        : project.i_am_admin
                          ? "Admin"
                          : project.i_am_member
                            ? "Member"
                            : "Not a Member"}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <Typography className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                {project.description || "No description"}
              </Typography>
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Typography size="xs">
                    Created:{" "}
                    {project.created_date
                      ? formatDate(project.created_date)
                      : "Unknown"}
                  </Typography>
                </div>
                <Typography size="xs" className="text-muted-foreground">
                  {project.tags?.length
                    ? project.tags.join(", ")
                    : "No tags available"}
                </Typography>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2">
                {canViewProject(project) ? (
                  <Link
                    href={`/dashboard/projects/${project.slug}`}
                    className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                  >
                    <Eye className="size-4" />
                    <span className="truncate">View Project</span>
                  </Link>
                ) : (
                  <Button disabled className="sm:col-span-3">
                    <Eye className="size-4" />
                    <span className="truncate">Membership Required</span>
                  </Button>
                )}

                {canEditProject(project) && (
                  <div className="grid grid-cols-2 gap-2">
                    <ProjectDialog
                      mode="edit"
                      project={project}
                      trigger={
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-full"
                        >
                          <Typography className="sr-only">Edit</Typography>
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
                          <Typography className="sr-only">Delete</Typography>
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-bold">
                              &#34;{project.name}
                              &#34;
                            </span>
                            ? This action cannot be undone and will permanently
                            remove the project and all its associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              project.id && handleDeleteProject(project.id)
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardFooter>{" "}
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationLayout
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
