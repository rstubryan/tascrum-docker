// src/components/organisms/membership/membership-dialog.tsx
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
import MembershipForm from "@/components/organisms/membership/form/membership-form";
import { MembershipProps } from "@/api/membership/type";

interface MembershipDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  membership?: MembershipProps;
  onSuccess?: () => void;
}

export default function MembershipDialog({
  trigger,
  title,
  description,
  mode,
  membership,
  onSuccess,
}: MembershipDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Enter the username of the person you want to add to this project."
      : "Update the role of this team member.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title ||
              (mode === "create" ? "Add Team Member" : "Edit Team Member")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <MembershipForm
          onSuccess={handleSuccess}
          membership={membership}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
