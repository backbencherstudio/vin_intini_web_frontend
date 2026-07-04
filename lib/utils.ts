import dayjs from "@/lib/dayjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const formatAmount = ({
  type,
  value,
  range,
}: {
  type?: string;
  value: string;
  range?: number;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: range || 2,
    maximumFractionDigits: range || 2,
  }).format(Number(value));

export const formatNumber = ({
  type,
  value,
}: {
  type?: string;
  value: string;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));

export const formatNumberIntoK = ({
  type,
  value,
}: {
  type?: string;
  value: string;
}) => {
  const num = Number(value);
  if (num >= 1000) {
    return (
      new Intl.NumberFormat(type || "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.floor(num / 1000)) + "K"
    );
  }
  return new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
