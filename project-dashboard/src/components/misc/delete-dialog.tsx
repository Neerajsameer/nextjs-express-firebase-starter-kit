"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

let resolveDelete: ((value: boolean) => void) | null = null;

export function useDeleteDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Confirm Deletion");
  const [description, setDescription] = useState(
    "Are you sure you want to delete this item? This action cannot be undone."
  );

  const deleteDialog = ({
    title,
    description,
  }: {
    title?: string;
    description?: string;
  } = {}): Promise<boolean> => {
    setOpen(true);
    if (title) setTitle(title);
    if (description) setDescription(description);

    return new Promise((resolve) => {
      resolveDelete = resolve;
    });
  };

  const handleDelete = () => {
    if (resolveDelete) resolveDelete(true);
    setOpen(false);
  };

  const handleCancel = () => {
    if (resolveDelete) {
      resolveDelete(false);
    }
    setOpen(false);
  };

  return {
    showDeleteDialog: deleteDialog,
    DeleteDialogComponent: (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  };
}
