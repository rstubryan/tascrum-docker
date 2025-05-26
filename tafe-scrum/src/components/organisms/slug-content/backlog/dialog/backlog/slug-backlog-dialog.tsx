"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserStoryProps } from "@/api/backlog-us/type";
import SlugBacklogForm from "@/components/organisms/slug-content/backlog/form/backlog/slug-backlog-form";

interface SlugBacklogDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  userStory?: UserStoryProps;
  onSuccess?: () => void;
}

export default function SlugBacklogDialog({
  trigger,
  title,
  description,
  mode,
  userStory,
  onSuccess,
}: SlugBacklogDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new user story."
      : "Update the details of your user story.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title ||
              (mode === "create" ? "Create User Story" : "Edit User Story")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <SlugBacklogForm
          onSuccess={handleSuccess}
          userStory={userStory}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
