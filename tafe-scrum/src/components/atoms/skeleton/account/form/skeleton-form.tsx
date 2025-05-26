import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TabProfileSkeletonProps {
  type?: "loading" | "error";
}

export function TabProfileSkeleton({
  type = "loading",
}: TabProfileSkeletonProps) {
  if (type === "error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information and public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 w-full">
              <h3 className="mb-2 text-base font-medium">
                Unable to load profile data
              </h3>
              <p className="text-sm text-muted-foreground">
                There was an error loading your profile information. Please try
                again later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Username field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Email field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Full name field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Bio field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Submit button skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
