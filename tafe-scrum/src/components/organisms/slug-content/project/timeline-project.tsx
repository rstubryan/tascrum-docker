"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetTimelineByProjectId } from "@/api/timeline/queries";
import { Typography } from "@/components/atoms/typography/typography";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import { getInitials } from "@/utils/avatar-initials";
import { TimelineEventProps } from "@/api/timeline/type";
import { UserProps } from "@/api/user/type";
import { formatEvent, timeAgo } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useDeleteMembership } from "@/api/membership/mutation";

type ProjectMemberExtended = UserProps & {
  id: string | number;
  role_name?: string;
};

export default function TimelineProject() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const { data: timelines, isLoading } = useGetTimelineByProjectId(
    project?.id?.toString() || "",
  );
  const { mutate: deleteMembership } = useDeleteMembership();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const timelineArray = Array.isArray(timelines) ? timelines : [];

  const paginatedFeeds = timelineArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalItems = timelineArray.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (timelines) {
      setCurrentPage(1);
    }
  }, [timelines]);

  if (!project || isLoading) {
    return <div>Loading project details...</div>;
  }

  const members = project.members as unknown as ProjectMemberExtended[];

  const handleDeleteMember = (memberId: string | number) => {
    deleteMembership(memberId.toString(), {});
  };

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <section className="grow">
        {paginatedFeeds.length > 0 ? (
          <>
            {paginatedFeeds.map(
              (feed: TimelineEventProps, index: number) =>
                feed.data.user && (
                  <Card key={index} className="mt-5">
                    <CardHeader>
                      <div className="flex flex-col items-center justify-between sm:flex-row">
                        <div className="order-2 flex items-center gap-2 sm:order-1">
                          <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage
                              src={feed.data.user.photo}
                              alt={feed.data.user.name}
                            />
                            <AvatarFallback className="rounded-full">
                              {getInitials(feed.data.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <Typography>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: formatEvent(feed),
                              }}
                            />
                          </Typography>
                        </div>
                        <div className="order-1 w-full sm:order-2 sm:w-max">
                          <Typography>{timeAgo(feed.created)}</Typography>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ),
            )}

            {totalItems > itemsPerPage && (
              <div className="mt-5">
                <PaginationLayout
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="mt-5 flex h-40 items-center justify-center rounded-lg border border-dashed">
            <Typography>No timeline items found</Typography>
          </div>
        )}
      </section>

      {members && members.length > 0 && (
        <section className="w-full lg:w-96">
          {members.map((member: ProjectMemberExtended, index: number) => (
            <Card key={index} className="mt-5">
              <CardHeader>
                <section className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={member.photo || undefined}
                        alt={member.full_name_display || "Member"}
                      />
                      <AvatarFallback className="rounded-full">
                        {getInitials(member.full_name_display || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Typography>{member.full_name_display}</Typography>
                      {member.role_name && (
                        <Typography className="text-xs text-muted-foreground">
                          {member.role_name}
                        </Typography>
                      )}
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove{" "}
                          <span className="font-bold">
                            {member.full_name_display || member.username}
                          </span>{" "}
                          from this project? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </section>
              </CardHeader>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
