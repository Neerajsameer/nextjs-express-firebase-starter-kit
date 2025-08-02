"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

let resolvePrompt: ((value: string | null) => void) | null = null;

export function usePrompt() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [positiveButtonText, setPositiveButtonText] = useState("OK");
  const [negativeButtonText, setNegativeButtonText] = useState("Cancel");
  const [value, setValue] = useState("");

  const promptDialog = ({
    title,
    positiveButtonText,
    negativeButtonText,
  }: {
    title: string;
    positiveButtonText?: string;
    negativeButtonText?: string;
  }): Promise<string | null> => {
    setValue("");
    setOpen(true);
    setTitle(title);
    if (positiveButtonText) setPositiveButtonText(positiveButtonText);
    if (negativeButtonText) setNegativeButtonText(negativeButtonText);

    return new Promise((resolve) => {
      resolvePrompt = resolve;
    });
  };

  const handleSubmit = () => {
    if (resolvePrompt) {
      resolvePrompt(value);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (resolvePrompt) {
      resolvePrompt(null);
    }
    setOpen(false);
  };

  return {
    promptDialog,
    DialogComponent: (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {negativeButtonText}
            </Button>
            <Button onClick={handleSubmit}>{positiveButtonText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  };
}
