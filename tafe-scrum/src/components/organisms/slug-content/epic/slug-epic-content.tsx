"use client";

import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetEpicByRefIdAndProjectId } from "@/api/epic/queries";
import { getInitials } from "@/utils/avatar-initials";
import { formatDate } from "@/utils";
import { Separator } from "@/components/ui/separator";
import EpicDialog from "@/components/organisms/epic/epic-dialog";
import SlugEpicUsContent from "@/components/organisms/slug-content/epic/user-stories/slug-epic-us-content";

export default function SlugEpicContent() {
  const params = useParams();
  const slug = params.slug as string;
  const epicRef = params.id as string;

  const { data: project } = useGetProjectBySlug(slug);
  const { data: epic, isLoading: isLoadingEpic } =
    useGetEpicByRefIdAndProjectId(epicRef, project?.id?.toString() || "");

  if (isLoadingEpic) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading epic details...</Typography>
      </div>
    );
  }

  if (!epic) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Epic not found</Typography>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min">
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{
                  backgroundColor: epic.status_extra_info?.color || "#70728F",
                }}
              >
                <Typography className="font-bold text-white">
                  #{epic.ref}
                </Typography>
              </div>
              <div>
                <CardTitle className="line-clamp-1">{epic.subject}</CardTitle>
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
            {/* Edit button */}
            <EpicDialog
              mode="edit"
              epic={epic}
              trigger={
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Created:{" "}
                {epic.created_date ? formatDate(epic.created_date) : "N/A"}
              </span>
              <span>•</span>
              <span>
                Modified:{" "}
                {epic.modified_date ? formatDate(epic.modified_date) : "N/A"}
              </span>
              {epic.is_blocked && (
                <>
                  <span>•</span>
                  <span className="text-destructive font-medium">Blocked</span>
                </>
              )}
              <span>•</span>
              <span>
                Assigned to:{" "}
                {epic.assigned_to_extra_info
                  ? epic.assigned_to_extra_info.full_name_display
                  : "Unassigned"}
              </span>
            </div>
            {epic.owner_extra_info && (
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarImage
                    src={epic.owner_extra_info.photo || undefined}
                    alt={epic.owner_extra_info.full_name_display}
                  />
                  <AvatarFallback>
                    {getInitials(epic.owner_extra_info.full_name_display)}
                  </AvatarFallback>
                </Avatar>
                <Typography size="xs" className="text-primary">
                  by {epic.owner_extra_info.full_name_display}
                </Typography>
              </div>
            )}
            <div className="mt-4">
              <Typography size="sm" className="font-medium">
                User Stories
              </Typography>
              <div className="mt-1 flex items-center gap-1">
                <span>Total:</span>
                <span className="font-medium">
                  {epic.user_stories_counts?.total || 0}
                </span>
                {typeof epic.user_stories_counts?.progress === "number" && (
                  <>
                    <span>•</span>
                    <span>Progress:</span>
                    <span className="font-medium">
                      {Math.round(epic.user_stories_counts.progress)}%
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="prose mt-6 mb-6">
              {epic.description_html ? (
                <div
                  dangerouslySetInnerHTML={{ __html: epic.description_html }}
                />
              ) : (
                epic.description || "No description available"
              )}
            </div>
            {epic.is_blocked && epic.blocked_note && (
              <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <Typography size="sm" className="text-destructive font-medium">
                  Blocked Note:
                </Typography>
                <div className="mt-1">
                  {epic.blocked_note_html ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: epic.blocked_note_html,
                      }}
                    />
                  ) : (
                    epic.blocked_note
                  )}
                </div>
              </div>
            )}
            <Separator className="my-2" />
            <SlugEpicUsContent />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
