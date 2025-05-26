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
import SlugEpicRelatedUsForm from "@/components/organisms/slug-content/epic/form/slug-epic-related-us-form";

interface SlugEpicRelatedUsDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  epic: EpicProps;
  onSuccess?: () => void;
}

export default function SlugEpicRelatedUsDialog({
  trigger,
  title,
  description,
  epic,
  onSuccess,
}: SlugEpicRelatedUsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription = "Select a user story to relate to this epic.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || "Relate User Story"}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <SlugEpicRelatedUsForm onSuccess={handleSuccess} epic={epic} />
      </DialogContent>
    </Dialog>
  );
}
