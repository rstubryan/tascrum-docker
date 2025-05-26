"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/organisms/project/form/project-form";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectProps } from "@/api/project/type";

interface DialogProjectProps {
  mode: "create" | "edit";
  project?: ProjectProps;
  trigger?: React.ReactNode;
}

export default function ProjectDialog({
  mode = "create",
  project,
  trigger,
}: DialogProjectProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger =
    mode === "create" ? (
      <Button variant="outline" className="sm:w-max w-full">
        <Plus />
        Create Project
      </Button>
    ) : (
      <Button variant="outline" size="sm">
        <Edit />
        Edit Project
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details below to create a project."
              : "Update the details of your project."}
          </DialogDescription>
          <ProjectForm
            mode={mode}
            project={project}
            onSuccess={() => setOpen(false)}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
