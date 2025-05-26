"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Frame,
  GalleryVerticalEnd,
  LoaderCircle,
  Map,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/templates/sidebar/nav-main";
import { NavProject } from "@/components/templates/sidebar/nav-project";
import { NavDocumentation } from "@/components/templates/sidebar/nav-documentation";
import { NavUser } from "@/components/templates/sidebar/nav-user";
import { ProjectSwitcher } from "@/components/templates/sidebar/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetUserAuth } from "@/api/user/queries";
import { useGetProjectsByUser } from "@/api/project/queries";
import { UserProps } from "@/api/user/type";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState, useEffect } from "react";
import { ProjectProps } from "@/api/project/type";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const projectSlug = (params?.slug as string) || "";
  const [mounted, setMounted] = useState(false);
  const { currentUserId } = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  const canFetchProjects = mounted && !!currentUserId;

  const { data: myProjects, isLoading: isLoadingMyProjects } =
    useGetProjectsByUser(currentUserId?.toString() || "", {
      enabled: canFetchProjects,
      retry: 3,
      retryDelay: 300,
    });

  const { data } = useGetUserAuth();

  const extractUserData = (): UserProps => {
    if (!data) return {} as UserProps;

    if ("data" in data && data.data) {
      return data.data as UserProps;
    }

    return data as unknown as UserProps;
  };

  const userData = extractUserData();

  const userInfo = {
    name: userData.full_name_display || userData.username || "User",
    email: userData.email || "",
    avatar: userData.photo || "",
  };

  const processProjects = () => {
    if (!Array.isArray(myProjects) || myProjects.length === 0) {
      return [] as {
        name: string | undefined;
        logo: React.ElementType;
        plan: string;
        slug: string | undefined;
      }[];
    }

    return myProjects.map((project: ProjectProps) => ({
      name: project.name,
      logo: GalleryVerticalEnd,
      plan: project.is_private ? "Private" : "Public",
      slug: project.slug,
    }));
  };

  const projectsList = processProjects();

  const activeProject =
    projectSlug && projectsList.length > 0
      ? projectsList.find((p) => p.slug === projectSlug)
      : undefined;

  const totalProjects = projectsList.length;
  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const getPaginatedProjects = () => {
    if (projectsList.length === 0) return [];

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return projectsList.slice(startIdx, endIdx);
  };

  const paginatedProjects = getPaginatedProjects();

  const sidebarNavData = {
    projects: paginatedProjects,
    project_list: [
      {
        name: "Projects",
        url: "/dashboard/projects",
        icon: GalleryVerticalEnd,
      },
    ],
    navMain: projectSlug
      ? [
          {
            title: "Scrum",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
              {
                title: "Backlogs",
                url: `/dashboard/projects/${projectSlug}/backlogs`,
              },
              {
                title: "Tasks",
                url: `/dashboard/projects/${projectSlug}/tasks`,
              },
              {
                title: "Epics",
                url: `/dashboard/projects/${projectSlug}/epics`,
              },
              {
                title: "Sprints",
                url: `/dashboard/projects/${projectSlug}/sprints`,
              },
              {
                title: "Issues",
                url: `/dashboard/projects/${projectSlug}/issues`,
              },
            ],
          },
        ]
      : [],
    documentation: [
      {
        name: "Introduction",
        url: "/dashboard/documentation/[slug]",
        icon: Frame,
      },
      {
        name: "Get Started",
        url: "/dashboard/documentation/[slug]",
        icon: Map,
      },
      {
        name: "Tutorials",
        url: "/dashboard/documentation/[slug]",
        icon: Settings2,
      },
      {
        name: "Changelog",
        url: "/dashboard/documentation/[slug]",
        icon: GalleryVerticalEnd,
      },
    ],
  };

  if (isLoadingMyProjects && mounted) {
    return (
      <div className="flex justify-center py-8">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher
          projects={paginatedProjects}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          activeProject={activeProject}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavProject project_list={sidebarNavData.project_list} />
        <NavMain items={sidebarNavData.navMain} />
        <NavDocumentation documentation={sidebarNavData.documentation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
