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
import IssueForm from "@/components/organisms/issue/form/issue-form";
import { IssueProps } from "@/api/issue/type";

interface IssueDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  issue?: IssueProps;
  onSuccess?: () => void;
}

export default function IssueDialog({
  trigger,
  title,
  description,
  mode,
  issue,
  onSuccess,
}: IssueDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new issue."
      : "Update the details of your issue.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title || (mode === "create" ? "Create Issue" : "Edit Issue")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <IssueForm onSuccess={handleSuccess} issue={issue} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
