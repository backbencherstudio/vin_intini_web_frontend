"use client";

import { EmojiIcon } from "@/public/svgIcons/Icons";
import EmojiPicker, {
  Categories,
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

interface SmartEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  iconClassName?: string;
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark" | "auto";
  direction?: "up" | "down" | "auto";
  showPreview?: boolean;
  skinTonesDisabled?: boolean;
}

export default function SmartEmojiPicker({
  onEmojiSelect,
  iconClassName = "w-5 h-5",
  width = 310,
  height = 290,
  theme = "light",
  direction = "up",
  skinTonesDisabled = true,
}: SmartEmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerDirection, setPickerDirection] = useState<"up" | "down">(
    direction === "auto" ? "up" : direction,
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const togglePicker = () => {
    if (!isOpen && buttonRef.current && direction === "auto") {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const numHeight = typeof height === "number" ? height : 290;
      setPickerDirection(spaceBelow < numHeight ? "up" : "down");
    } else if (direction !== "auto") {
      setPickerDirection(direction);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !pickerRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const resolvedTheme =
    theme === "dark"
      ? Theme.DARK
      : theme === "light"
        ? Theme.LIGHT
        : Theme.AUTO;

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        ref={buttonRef}
        type="button"
        className={`p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-descriptionColor transition-colors ${
          isOpen ? "bg-gray-100 text-[#1BAABE]" : ""
        }`}
        onClick={togglePicker}
        aria-label="Toggle emoji picker"
      >
        <EmojiIcon className={iconClassName} />
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className={`absolute left-0 z-50 rounded-2xl border border-gray-100/80 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${
            pickerDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <EmojiPicker
            onEmojiClick={(data: EmojiClickData) => {
              onEmojiSelect(data.emoji);
            }}
            emojiStyle={EmojiStyle.APPLE}
            width={width}
            height={height}
            theme={resolvedTheme}
            searchPlaceHolder="Search emoji..."
            skinTonesDisabled={skinTonesDisabled}
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis={true}
            className="smart-native-emoji-picker"
            categories={[
              { category: Categories.SMILEYS_PEOPLE, name: "Smileys & People" },
              { category: Categories.ANIMALS_NATURE, name: "Animals & Nature" },
              { category: Categories.FOOD_DRINK, name: "Food & Drink" },
              { category: Categories.TRAVEL_PLACES, name: "Travel & Places" },
              { category: Categories.ACTIVITIES, name: "Activities" },
              { category: Categories.OBJECTS, name: "Objects" },
              { category: Categories.SYMBOLS, name: "Symbols" },
              { category: Categories.FLAGS, name: "Flags" },
            ]}
            style={{
              ["--epr-emoji-size" as string]: "20px",
              ["--epr-emoji-padding" as string]: "4px",
              ["--epr-emoji-gap" as string]: "5px",
              ["--epr-category-navigation-button-size" as string]: "22px",
              ["--epr-category-icon-active-color" as string]: "#1BAABE",
              ["--epr-category-icon-inactive-color" as string]: "#9ca3af",
              ["--epr-hover-bg-color" as string]: "#f3f4f6",
              ["--epr-focus-bg-color" as string]: "#f3f4f6",
              ["--epr-highlight-color" as string]: "#1BAABE",
              ["--epr-bg-color" as string]: "#ffffff",
              ["--epr-category-label-bg-color" as string]: "#ffffff",
              ["--epr-category-label-text-color" as string]: "#6b7280",
              ["--epr-category-label-height" as string]: "28px",
              ["--epr-search-input-bg-color" as string]: "#f9fafb",
              ["--epr-search-input-bg-color-active" as string]: "#ffffff",
              ["--epr-search-border-color" as string]: "#e5e7eb",
              ["--epr-search-border-color-active" as string]: "#1BAABE",
              ["--epr-search-input-border-radius" as string]: "10px",
              ["--epr-search-input-height" as string]: "36px",
              ["--epr-search-input-placeholder-color" as string]: "#9ca3af",
              ["--epr-picker-border-color" as string]: "transparent",
              ["--epr-header-padding" as string]: "8px 10px",
              ["--epr-horizontal-padding" as string]: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
}
