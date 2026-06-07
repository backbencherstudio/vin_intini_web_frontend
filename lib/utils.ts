import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "@/lib/dayjs";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeSkillsList(skills?: unknown): string[] {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;

      if (skill && typeof skill === "object") {
        const typedSkill = skill as Record<string, unknown>;
        const value =
          typedSkill.value ??
          typedSkill.label ??
          typedSkill.name ??
          typedSkill.skill_name ??
          typedSkill.title;

        return typeof value === "string" ? value : "";
      }

      return "";
    })
    .filter(Boolean);
}

 export const formatPostDate = (date: string) => {
    const postDate = dayjs(date);
    const now = dayjs();
    const diffDays = now.diff(postDate, "day");

    if (diffDays >= 365) {
      const years = now.diff(postDate, "year");
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }

    if (diffDays >= 30) {
      const months = now.diff(postDate, "month");
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    return postDate.fromNow();
  };