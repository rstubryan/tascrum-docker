"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/avatar-initials";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetUserStoryByRefAndProjectId } from "@/api/backlog-us/queries";
import { formatDate } from "@/utils";
import SlugBacklogTask from "@/components/organisms/slug-content/backlog/slug-backlog-task";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import SlugBacklogDialog from "@/components/organisms/slug-content/backlog/dialog/backlog/slug-backlog-dialog";

export default function SlugBacklogContent() {
  const params = useParams();
  const slug = params.slug as string;
  const storyRef = params.id as string;

  const { data: project } = useGetProjectBySlug(slug);
  const { data: userStory, isLoading: isLoadingUserStory } =
    useGetUserStoryByRefAndProjectId(storyRef, project?.id?.toString() || "");

  if (isLoadingUserStory) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading user story details...</Typography>
      </div>
    );
  }

  if (!userStory) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>User story not found</Typography>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min">
      <Card className="my-6">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{
                  backgroundColor:
                    userStory.status_extra_info?.color || "#70728F",
                }}
              >
                <Typography className="font-bold text-white">
                  #{userStory.ref}
                </Typography>
              </div>
              <div>
                <CardTitle className="line-clamp-1">
                  {userStory.subject}
                </CardTitle>
                <CardContent className="p-0">
                  <Typography className="flex gap-1 text-xs text-muted-foreground">
                    <span
                      style={{
                        color: userStory.status_extra_info?.color || "#70728F",
                      }}
                    >
                      {userStory.status_extra_info?.name || "New"}
                    </span>
                    <span>•</span>
                    <span className="font-medium">
                      {userStory.is_closed ? "Closed" : "Open"}
                    </span>
                  </Typography>
                </CardContent>
              </div>
            </div>
            <SlugBacklogDialog
              trigger={
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              }
              mode="edit"
              userStory={userStory}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Created:{" "}
                {userStory.created_date
                  ? formatDate(userStory.created_date)
                  : "N/A"}
              </span>
              <span>•</span>
              <span>
                Modified:{" "}
                {userStory.modified_date
                  ? formatDate(userStory.modified_date)
                  : "N/A"}
              </span>
              <span>•</span>
              <span>
                Due:{" "}
                {userStory.due_date
                  ? formatDate(userStory.due_date)
                  : "Not available"}
              </span>
              <span>•</span>
              <span>
                Assigned to:{" "}
                {userStory.assigned_to_extra_info
                  ? userStory.assigned_to_extra_info.full_name_display
                  : "Unassigned"}
              </span>
            </div>

            {userStory.owner_extra_info && (
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarImage
                    src={userStory.owner_extra_info.photo || undefined}
                    alt={userStory.owner_extra_info.full_name_display}
                  />
                  <AvatarFallback>
                    {getInitials(userStory.owner_extra_info.full_name_display)}
                  </AvatarFallback>
                </Avatar>
                <Typography size="xs" className="text-primary">
                  by {userStory.owner_extra_info.full_name_display}
                </Typography>
              </div>
            )}

            <div className="prose mt-6 mb-6">
              {userStory.description || "No description available"}
            </div>

            <Separator className="my-2" />

            <SlugBacklogTask
              projectId={project?.id?.toString() || ""}
              userStoryId={userStory.id?.toString() || ""}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
