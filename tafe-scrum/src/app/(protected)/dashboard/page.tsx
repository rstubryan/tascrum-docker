import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography/typography";
import { PlusCircle } from "lucide-react";
import MainContent from "@/components/templates/content/main-content";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <MainContent className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-8 max-w-4xl w-full">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2 text-center">
          <Typography size="h1">Welcome to Your Dashboard</Typography>
          <Typography className="text-muted-foreground">
            Manage your projects and track issues efficiently
          </Typography>
        </div>

        {/* Get Started / Create Project */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <Typography size="h3">Get Started</Typography>
                <Typography className="text-muted-foreground max-w-md">
                  Create your first project to start tracking issues and
                  collaborating with your team.
                </Typography>
              </div>
              <Link href={"/dashboard/projects"} className="w-full md:w-auto">
                <Button size="lg" className="gap-2 w-full md:w-auto">
                  <PlusCircle className="h-5 w-5" />
                  <span>Create New Project</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainContent>
  );
}
