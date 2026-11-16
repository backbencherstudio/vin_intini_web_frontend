"use client";

import React, { useState, KeyboardEvent, useMemo } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface TagInputFieldProps {
  id?: string;
  label?: string;
  value?: string | string[];
  onChange?: (val: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  maxTags?: number;
}

export default function TagInputField({
  id = "tags",
  label = "Tags & Keywords",
  value = "",
  onChange,
  placeholder = "Type tag and press Enter...",
  error,
  helperText = "Press Enter or comma (,) to add each tag",
  className,
  maxTags = 20,
}: TagInputFieldProps) {
  const [inputValue, setInputValue] = useState("");

  // Parse value into array of strings
  const tags: string[] = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).map((t) => t.trim()).filter(Boolean);
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map((t) => t.trim()).filter(Boolean);
        }
      } catch {
        // comma-separated
      }
      return value.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return [];
  }, [value]);

  const updateTags = (newTags: string[]) => {
    onChange?.(newTags.join(", "));
  };

  const addTag = (rawTag: string) => {
    const trimmed = rawTag.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;

    // Support comma-separated in paste/multi-word
    const candidates = trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = [...tags];
    for (const cand of candidates) {
      if (
        !updated.some((t) => t.toLowerCase() === cand.toLowerCase()) &&
        updated.length < maxTags
      ) {
        updated.push(cand);
      }
    }

    updateTags(updated);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    const updated = tags.filter((_, idx) => idx !== indexToRemove);
    updateTags(updated);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      e.stopPropagation();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-descriptionColor flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-[#009dae]" /> {label}
          </span>
          <span className="text-[11px] text-gray-400 font-normal">
            {tags.length}/{maxTags} tags
          </span>
        </Label>
      )}

      {/* Tags Container + Input */}
      <div
        className={cn(
          "min-h-12 w-full rounded-xl border bg-white p-2 transition-all flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-[#009dae]/20 focus-within:border-[#009dae]",
          error ? "border-red-500 ring-1 ring-red-500/20" : "border-borderColor hover:border-gray-300"
        )}
      >
        {/* Render Badges */}
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#009dae]/10 text-[#009dae] border border-[#009dae]/20 text-xs font-semibold animate-in fade-in-50 zoom-in-95 duration-150"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeTag(idx);
              }}
              className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-[#009dae]/20 text-[#009dae] transition cursor-pointer"
              title={`Remove ${tag}`}
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </span>
        ))}

        {/* Text Input */}
        {tags.length < maxTags && (
          <div className="flex-1 min-w-[140px] flex items-center gap-1">
            <input
              id={id}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) {
                  addTag(inputValue);
                }
              }}
              placeholder={tags.length === 0 ? placeholder : "Add more..."}
              className="w-full text-xs sm:text-sm text-headerColor bg-transparent border-none outline-none placeholder:text-gray-400 px-1 py-1"
            />
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="shrink-0 p-1 rounded-md bg-[#009dae] text-white hover:bg-[#008999] transition cursor-pointer"
                title="Add tag"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Helper text or error */}
      {error ? (
        <p className="text-redColor text-xs">{error}</p>
      ) : (
        helperText && <p className="text-[11px] text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
