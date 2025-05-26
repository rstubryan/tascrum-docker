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
import { SprintProps } from "@/api/sprint/type";
import SlugUsAssociateForm from "@/components/organisms/slug-content/sprint/form/slug-us-associate-form";

interface SlugSprintDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  sprint: SprintProps;
  onSuccess?: () => void;
}

export default function SlugSprintDialog({
  trigger,
  title,
  description,
  sprint,
  onSuccess,
}: SlugSprintDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    "Select user stories to associate with this sprint.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || "Associate User Stories"}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <SlugUsAssociateForm onSuccess={handleSuccess} sprint={sprint} />
      </DialogContent>
    </Dialog>
  );
}
