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
  buttons?: (string | { name: string })[];
  className?: string;
}

function JoditEditor({
  value = "",
  placeholder,
  onChange,
  onBlur,
  showToolbar = true,
  height = 180,
  buttons,
  className,
}: JoditEditorProps) {
  const config = useMemo(
    () => ({
      readonly: false,
      height,
      minHeight: height,
      placeholder,
      toolbar: showToolbar,
      toolbarAdaptive: false,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: true,
      showXPathInStatusbar: false,
      showBrowserColorPicker: false,
      showCharsCounter: false,
      showWordsCounter: false,
      statusbar: false,
      allowResizeX: false,
      allowResizeY: false,
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
    [buttons, height, placeholder, showToolbar],
  );

  return (
    <div className={cn("[&_.jodit-add-new-line]:hidden!", className)}>
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
