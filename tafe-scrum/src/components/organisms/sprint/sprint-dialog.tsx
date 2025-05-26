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
import SprintForm from "@/components/organisms/sprint/form/sprint-form";
import { SprintProps } from "@/api/sprint/type";

interface SprintDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  sprint?: SprintProps;
  onSuccess?: () => void;
}

export default function SprintDialog({
  trigger,
  title,
  description,
  mode,
  sprint,
  onSuccess,
}: SprintDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new sprint."
      : "Update the details of your sprint.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title || (mode === "create" ? "Create Sprint" : "Edit Sprint")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <SprintForm onSuccess={handleSuccess} sprint={sprint} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
