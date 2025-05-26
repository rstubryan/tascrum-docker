import { headers } from "next/headers";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";

export default async function HeaderBreadcrumb() {
  const headersList = await headers();
  const currentPath = headersList.get("x-current-path") || "";

  const pathSegments = currentPath
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      const formattedSegment = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        name: formattedSegment,
        path: `/${segment}`,
      };
    });

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path =
      "/" +
      pathSegments
        .slice(0, index + 1)
        .map((s) => s.name.toLowerCase().replace(/\s+/g, "-"))
        .join("/");
    return {
      name: segment.name,
      path,
    };
  });

  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ name: "Home", path: "/" });
  }

  return (
    <>
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index < breadcrumbItems.length - 1 ? (
                <BreadcrumbItem key={item.path} className="hidden md:block">
                  <Link href={item.path}>{item.name}</Link>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem key={item.path}>
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
