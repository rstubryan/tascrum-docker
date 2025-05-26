"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscoverTab from "./tabs/discover-tab";
import MyProjectTab from "./tabs/my-project-tab";

export default function ProjectTabs() {
  return (
    <Tabs defaultValue="my-project" className="w-full my-4">
      <TabsList className="w-full">
        <TabsTrigger value="my-project" className={"w-full"}>
          My Project
        </TabsTrigger>
        <TabsTrigger value="discover" className={"w-full"}>
          Discover
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-project">
        <MyProjectTab />
      </TabsContent>
      <TabsContent value="discover">
        <DiscoverTab />
      </TabsContent>
    </Tabs>
  );
}
