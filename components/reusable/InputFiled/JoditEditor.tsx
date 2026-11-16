"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const JoditEditors = dynamic(() => import("jodit-react"), { ssr: false });

interface JoditEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  showToolbar?: boolean;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  allowResizeY?: boolean;
  buttons?: (string | { name: string })[];
  className?: string;
}

function JoditEditor({
  value = "",
  placeholder,
  onChange,
  onBlur,
  showToolbar = true,
  height = 280,
  minHeight = 220,
  maxHeight = 1200,
  allowResizeY = true,
  buttons,
  className,
}: JoditEditorProps) {
  const config = useMemo(
    () => ({
      readonly: false,
      height,
      minHeight,
      maxHeight,
      placeholder,
      toolbar: showToolbar,
      toolbarAdaptive: false,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: true,
      showXPathInStatusbar: false,
      showBrowserColorPicker: false,
      showCharsCounter: false,
      showWordsCounter: false,
      statusbar: allowResizeY,
      allowResizeX: false,
      allowResizeY,
      addNewLine: false,
      addNewLineOnDBLClick: false,
      cleanHTML: {
        fillEmptyParagraph: true,
      },
      list: {
        indent: 20,
      },
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif"],
        maximumImageFileSize: 1000000,
      },
      buttons: showToolbar
        ? buttons || [
            "bold",
            "italic",
            "underline",
            "|",
            "ul",
            "ol",
            "|",
            "paragraph",
            "|",
            "link",
            "|",
            "align",
            "|",
            "undo",
            "redo",
          ]
        : [],
    }),
    [buttons, height, minHeight, maxHeight, placeholder, showToolbar, allowResizeY],
  );

  return (
    <div
      className={cn(
        "[&_.jodit-add-new-line]:hidden!",
        "[&_.jodit-status-bar]:bg-gray-50",
        "[&_.jodit-status-bar]:border-t",
        "[&_.jodit-status-bar]:border-gray-100",
        "[&_.jodit-status-bar]:min-h-[22px]",
        "[&_.jodit-status-bar]:py-0.5",
        "[&_.jodit-status-bar]:px-2",
        "[&_.jodit-status-bar-resizer]:cursor-ns-resize",
        "[&_.jodit-status-bar-resizer]:opacity-70",
        "[&_.jodit-status-bar-resizer]:hover:opacity-100",
        className
      )}
    >
      <JoditEditors
        value={value}
        config={config}
        onChange={(content: string) => onChange?.(content || "")}
        onBlur={() => onBlur?.()}
      />
    </div>
  );
}

export default JoditEditor;
