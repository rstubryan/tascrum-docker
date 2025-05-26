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
import { EpicProps } from "@/api/epic/type";
import EpicForm from "@/components/organisms/epic/form/epic-form";

interface EpicDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  epic?: EpicProps;
  onSuccess?: () => void;
}

export default function EpicDialog({
  trigger,
  title,
  description,
  mode,
  epic,
  onSuccess,
}: EpicDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new epic."
      : "Update the details of your epic.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title || (mode === "create" ? "Create Epic" : "Edit Epic")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <EpicForm onSuccess={handleSuccess} epic={epic} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
