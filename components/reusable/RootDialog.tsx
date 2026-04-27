import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";

function RootDialog({
  open,
  setOpen,
  children,
  className,
  ariaLabel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div>
      <Dialog  open={open} onOpenChange={setOpen} aria-label={ariaLabel}>
        <DialogContent
          className={`p-0 sm:max-w-2xl w-full max-h-[90vh] ${className}`}
        >
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RootDialog;
