import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  VisuallyHidden,
} from "../ui/dialog";

function RootDialog({
  open,
  setOpen,
  children,
  className,
  ariaLabel,
  ariaDescription,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescription?: string;
}) {
  React.useEffect(() => {
    if (!open) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen} aria-label={ariaLabel}>
        <DialogContent
          className={`p-0 sm:max-w-2xl w-full max-h-[90vh] overflow-hidden overscroll-contain [overscroll-behavior:contain] scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
        >
          <VisuallyHidden>
            <DialogTitle>{ariaLabel || "Dialog"}</DialogTitle>
            <DialogDescription>
              {ariaDescription || "Dialog content"}
            </DialogDescription>
          </VisuallyHidden>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RootDialog;
