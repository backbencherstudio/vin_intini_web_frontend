"use client";

import { EmojiIcon } from "@/public/svgIcons/Icons";
import EmojiPicker, {
  Categories,
  type EmojiClickData,
} from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

interface SmartEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  iconClassName?: string;
  width?: number ;
  height?: number ;
  theme?: "light" | "dark" | "auto";
  showPreview?: boolean;
}

export default function SmartEmojiPicker({
  onEmojiSelect,
  iconClassName = "w-5 h-5",
  width = 280,
  height = 350,
  theme = "auto",
}: SmartEmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const togglePicker = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      setDirection(spaceBelow < height ? "up" : "down");
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        ref={buttonRef}
        type="button"
        className="cursor-pointer hover:opacity-80 p-1"
        onClick={togglePicker}
      >
        <EmojiIcon className={iconClassName} />
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className={`absolute left-0 z-50 ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <EmojiPicker
            onEmojiClick={(data: EmojiClickData) => {
              onEmojiSelect(data.emoji);
            }}
            lazyLoadEmojis
            width={width}
            height={height}
            theme={theme as any}
            previewConfig={{ showPreview: false }}
            searchDisabled
            className="comment-emoji-picker"
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
              ["--epr-emoji-gap" as string]: "6px",
              ["--epr-category-navigation-button-size" as string]: "24px",
              ["--epr-category-icon-active-color" as string]: "#ef4444", // আইকন কালার কি হবে
              ["--epr-hover-bg-color" as string]: "transparent",
              ["--epr-focus-bg-color" as string]: "transparent",
              ["--epr-highlight-color" as string]: "transparent",
            }}
          />
        </div>
      )}
    </div>
  );
}
