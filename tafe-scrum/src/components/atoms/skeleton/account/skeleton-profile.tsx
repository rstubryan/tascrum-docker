import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoadingProps {
  type?: "edit-profile" | "error";
}

export function ProfileSkeleton({
  type = "edit-profile",
}: SkeletonLoadingProps) {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 max-w-md">
          <h3 className="mb-2 text-base font-medium">
            Unable to load profile data
          </h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading your profile information. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-4">
      <div className="grid grid-cols-1 sm:gap-6 gap-0 md:grid-cols-[250px_1fr]">
        {/* Left sidebar skeleton */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
            {/* Avatar skeleton */}
            <div className="relative">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full" />
            </div>

            {/* User info skeleton */}
            <div className="space-y-1 w-full">
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          </div>

          {/* Mobile tabs skeleton */}
          <div className="md:hidden">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Desktop navigation skeleton */}
          <div className="hidden rounded-lg border p-3 md:block">
            <div className="space-y-1">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Right content area skeleton */}
        <div className="space-y-6">
          {/* Card skeleton */}
          <div className="rounded-lg border">
            {/* Card header */}
            <div className="p-6 pb-0">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>

            {/* Card content */}
            <div className="p-6 space-y-4">
              {/* Form fields */}
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    {i % 2 === 0 && <Skeleton className="h-3 w-56" />}
                  </div>
                ))}

              {/* Submit button */}
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
