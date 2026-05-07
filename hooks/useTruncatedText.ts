import { useState } from "react";

interface UseTruncatedTextOptions {
  maxLength?: number;
  initialExpanded?: boolean;
}

interface UseTruncatedTextReturn {
  displayText: string;
  isExpanded: boolean;
  toggleExpanded: () => void;
  shouldShowButton: boolean;
}

/**
 * Custom hook for managing truncated text with "See more/less" functionality
 * @param text - The text to truncate
 * @param options - Configuration options (maxLength, initialExpanded)
 * @returns Object with displayText, isExpanded state, toggle function, and button visibility flag
 */
export const useTruncatedText = (
  text: string | null | undefined,
  options: UseTruncatedTextOptions = {},
): UseTruncatedTextReturn => {
  const { maxLength = 200, initialExpanded = false } = options;
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const shouldShowButton = text ? text.length > maxLength : false;

  const displayText = isExpanded
    ? text
    : text && text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;

  return {
    displayText,
    isExpanded,
    toggleExpanded: () => setIsExpanded(!isExpanded),
    shouldShowButton,
  };
};
