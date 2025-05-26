"use client";

import { type LucideIcon } from "lucide-react";
import { useParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavDocumentation({
  documentation,
}: {
  documentation: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const params = useParams();
  const docSlug = params?.slug || "introduction";

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documentation</SidebarGroupLabel>
      <SidebarMenu>
        {documentation.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url.replace("[slug]", docSlug.toString())}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
