"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Unlink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserStoryProps } from "@/api/backlog-us/type";
import SlugSprintDialog from "@/components/organisms/slug-content/sprint/slug-sprint-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import { getInitials } from "@/utils/avatar-initials";
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
import { useDeleteAssociateUserStoriesFromSprint } from "@/api/backlog-us/mutation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { SprintProps } from "@/api/sprint/type";

interface SlugUsAssociateContentProps {
  sprint: SprintProps;
}

export default function SlugUsAssociateContent({
  sprint,
}: SlugUsAssociateContentProps) {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: project } = useGetProjectBySlug(slug);
  const { mutate: unlinkUserStoryFromSprint } =
    useDeleteAssociateUserStoriesFromSprint();

  const handleUnlinkUserStory = (storyId?: number) => {
    if (!storyId || !project?.id) return;

    unlinkUserStoryFromSprint({
      projectId: parseInt(project.id.toString()),
      userStoryIds: [storyId],
    });
  };

  const userStoriesArray = sprint?.user_stories || [];
  const userStoriesCount = userStoriesArray.length;

  const paginatedStories = userStoriesArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(userStoriesCount / itemsPerPage);

  useEffect(() => {
    if (sprint?.user_stories) {
      setCurrentPage(1);
    }
  }, [sprint?.user_stories]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Typography size="h3">User Stories</Typography>
        <SlugSprintDialog
          sprint={sprint}
          trigger={
            <Button variant="outline" size="sm">
              <Plus size={16} />
              Associate User Stories
            </Button>
          }
        />
      </div>

      {userStoriesCount === 0 ? (
        <Alert>
          <AlertTitle>No user stories found</AlertTitle>
          <AlertDescription>
            This sprint doesn&#39;t have any user stories assigned to it yet.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedStories.map((story: UserStoryProps) => (
            <Card key={story.id} className="flex h-full flex-col">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md"
                      style={{
                        backgroundColor:
                          story.status_extra_info?.color || "#70728F",
                      }}
                    >
                      <Typography className="font-bold text-white">
                        #{story.ref}
                      </Typography>
                    </div>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {story.subject}
                      </CardTitle>
                      <CardContent className="p-0">
                        <Typography className="flex gap-1 text-xs text-muted-foreground">
                          <span
                            style={{
                              color:
                                story.status_extra_info?.color || "#70728F",
                            }}
                          >
                            {story.status_extra_info?.name || "New"}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {story.is_closed ? "Closed" : "Open"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <span className="sr-only">Unlink</span>
                        <Unlink className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unlink User Story</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove{" "}
                          <span className="font-bold">
                            &quot;{story.subject}&quot;
                          </span>{" "}
                          from this sprint? This will not delete the user story.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleUnlinkUserStory(story.id)}
                        >
                          Unlink
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      Created:{" "}
                      {story.created_date
                        ? formatDate(story.created_date)
                        : "N/A"}
                    </span>
                    <span>•</span>
                    <span>
                      Modified:{" "}
                      {story.modified_date
                        ? formatDate(story.modified_date)
                        : "N/A"}
                    </span>
                    {story.due_date && (
                      <>
                        <span>•</span>
                        <span>Due: {formatDate(story.due_date)}</span>
                      </>
                    )}
                  </div>

                  {story.owner_extra_info && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-full">
                        <AvatarImage
                          src={story.owner_extra_info.photo}
                          alt={story.owner_extra_info.full_name_display}
                        />
                        <AvatarFallback>
                          {getInitials(
                            story.owner_extra_info.full_name_display,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <Typography size="xs" className="text-primary">
                        by {story.owner_extra_info.full_name_display}
                      </Typography>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <Typography size="xs" className="text-primary">
                      Assigned to:{" "}
                      {story.assigned_to_extra_info
                        ? story.assigned_to_extra_info.full_name_display
                        : "Unassigned"}
                    </Typography>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1 items-center">
                    <Typography size="xs" className="text-primary mr-1">
                      Tags:
                    </Typography>
                    <div className="flex flex-wrap gap-1">
                      {story.tags && story.tags.length > 0 ? (
                        story.tags.map((tag, index) => (
                          <Badge key={index} className="text-xs">
                            {Array.isArray(tag) ? tag[0] : String(tag)}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          No tags available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/projects/${slug}/backlogs/${story.ref}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span className="truncate">View Details</span>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
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
