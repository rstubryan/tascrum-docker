"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  query: z.string(),
});

export function ProjectSwitcher({
  projects,
  currentPage,
  totalPages,
  setCurrentPage,
  activeProject,
}: {
  projects: {
    name: string | undefined;
    logo: React.ElementType;
    plan: string;
    slug?: string | undefined;
  }[];
  currentPage?: number;
  totalPages?: number;
  setCurrentPage?: (page: number) => void;
  activeProject?: {
    name: string | undefined;
    logo: React.ElementType;
    plan: string;
    slug?: string | undefined;
  };
}) {
  const { isMobile } = useSidebar();
  const [active, setActive] = React.useState(activeProject);
  const [filteredProjects, setFilteredProjects] = React.useState(projects);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  React.useEffect(() => {
    setActive(activeProject);
  }, [activeProject]);

  React.useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleSearch = (data: z.infer<typeof searchSchema>) => {
    if (!data.query.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) =>
      project.name?.toLowerCase().includes(data.query.toLowerCase()),
    );
    setFilteredProjects(filtered);
  };

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      handleSearch({ query: value.query || "" });
    });

    return () => subscription.unsubscribe();
  }, [form, projects]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {active ? (
                <>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <active.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {active.name || "Project"}
                    </span>
                    <span className="truncate text-xs">{active.plan}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Plus className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      Select a project
                    </span>
                    <span className="truncate text-xs">
                      No project selected
                    </span>
                  </div>
                </>
              )}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>Projects</span>
                {totalPages && totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage?.(Math.max(1, (currentPage || 1) - 1))
                      }
                      disabled={currentPage === 1}
                      className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-medium">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage?.(
                          Math.min(totalPages, (currentPage || 1) + 1),
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <Form {...form}>
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search projects..."
                            className="h-8 pl-8 text-xs"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    )}
                  />
                </form>
              </Form>
            </DropdownMenuLabel>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <DropdownMenuItem
                  key={`${project.name || "project"}-${index}`}
                  onClick={() => setActive(project)}
                  className="gap-2 p-2"
                  asChild
                >
                  <Link
                    href={`/dashboard/projects/${project.slug || (project.name || "project").toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <project.logo className="size-3.5 shrink-0" />
                    </div>
                    {project.name || "Project"}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-2 py-3 text-sm text-center text-muted-foreground">
                No projects found
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/dashboard/projects">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add project
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
