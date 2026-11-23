"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import Image from "next/image";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useGetAdminPageQuery,
  useUpdateAdminPageMutation,
  type AdminPageSlug,
} from "@/feature/slice/admin/settings/adminPagesApi";
import {
  Camera,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Compass,
  Eye,
  FileText,
  FolderOpen,
  GripVertical,
  Info,
  Landmark,
  Lightbulb,
  Loader2,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Upload,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "react-hot-toast";

const pages: { slug: AdminPageSlug; label: string; icon: typeof FileText }[] = [
  { slug: "about-us", label: "About Us", icon: FileText },
  { slug: "privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { slug: "terms-and-conditions", label: "Terms & Conditions", icon: FileText },
];

const aboutSections = [
  { id: "who", label: "Who We Are", icon: Target },
  { id: "team", label: "Meet The Team", icon: UsersRound, key: "team" },
  { id: "features", label: "Key Features", icon: Clapperboard, key: "videos" },
  { id: "faqs", label: "FAQ Management", icon: CircleHelp, key: "faqs" },
  {
    id: "institutions",
    label: "Leading Institutions",
    icon: Landmark,
    key: "leading_institutions",
  },
] as const;

type StructuredKey = "team" | "videos" | "faqs" | "leading_institutions";

const defaultCoreValues = { vision: "", mission: "", strategy: "" };
const defaultFounder = {
  name: "",
  designation: "",
  bio: "",
  signature: "",
};
const defaultStructuredContent: Record<StructuredKey, EditableRow[]> = {
  team: [],
  videos: [],
  faqs: [],
  leading_institutions: [],
};

type EditableRow = {
  id: string;
  original: Record<string, unknown>;
  fields: Record<string, string>;
};

const defaultRowFields: Record<StructuredKey, string[]> = {
  team: ["name", "title", "bio", "photo_url"],
  videos: ["title", "url", "thumbnail_url", "source"],
  faqs: ["question", "answer"],
  leading_institutions: [
    "name",
    "website",
    "description",
    "logo_url",
    "is_active",
  ],
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "VI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }
  return url;
}

function toEditableRows(value: unknown, defaults: string[]): EditableRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const original =
      typeof item === "object" && item !== null && !Array.isArray(item)
        ? (item as Record<string, unknown>)
        : { value: item };
    const entries = Object.entries(original);
    const fields = Object.fromEntries(defaults.map((key) => [key, ""]));
    entries.forEach(([key, fieldValue]) => {
      fields[key] =
        typeof fieldValue === "string"
          ? fieldValue
          : fieldValue == null
            ? ""
            : JSON.stringify(fieldValue);
    });
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      original,
      fields,
    };
  });
}

function toTeamEditableRows(value: unknown): EditableRow[] {
  return toEditableRows(value, defaultRowFields.team).map((row) => {
    const { designation, ...original } = row.original;
    const fields = { ...row.fields };
    fields.title ||= typeof designation === "string" ? designation : "";
    delete fields.designation;
    return { ...row, original, fields };
  });
}

function toInstitutionEditableRows(value: unknown): EditableRow[] {
  return toEditableRows(value, defaultRowFields.leading_institutions).map((row) => {
    const fields = { ...row.fields };
    delete fields.logo;
    const rawIsActive = row.original.is_active;
    fields.is_active =
      rawIsActive === false || rawIsActive === "0" || rawIsActive === "false"
        ? "false"
        : "true";
    return { ...row, fields };
  });
}

function toVideoEditableRows(value: unknown): EditableRow[] {
  return toEditableRows(value, defaultRowFields.videos).map((row) => {
    const fields = { ...row.fields };
    const source = fields.source || (row.original.type === "local_video" ? "file" : "url");
    fields.source = source === "url" ? "url" : "file";
    return { ...row, fields };
  });
}

function toApiRows(rows: EditableRow[], includeIds = new Set<string>()) {
  return rows
    .filter(({ id, fields }) => includeIds.has(id) || Object.values(fields).some((value) => value.trim()))
    .map(({ original, fields }) => {
      const result = { ...original };
      Object.entries(fields).forEach(([key, value]) => {
        if (!(key in original) && !value.trim()) return;
        const originalValue = original[key];
        if (typeof originalValue === "number" && value.trim()) {
          result[key] = Number(value);
        } else if (typeof originalValue === "boolean") {
          result[key] = value === "true";
        } else if (typeof originalValue === "object" && originalValue !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        } else {
          result[key] = value;
        }
      });
      return result;
    });
}

function getArrayLength(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function SectionHeading({
  number,
  title,
  description,
  badge,
  actions,
  children,
}: {
  number: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primaryColor/10 text-sm font-bold text-primaryColor">
            {number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h2>
              {badge && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{description}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function SortableTeamItem({
  item,
  index,
  photoUrl,
  onPhotoChange,
  onUpdateField,
  onDelete,
  isDropTarget,
}: {
  item: EditableRow;
  index: number;
  photoUrl: string;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateField: (field: string, value: string) => void;
  onDelete: () => void;
  isDropTarget: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  const photoInputId = `team-photo-${item.id}`;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={`rounded-xl border p-3.5 transition-all duration-200 ${
        isDragging
          ? "border-sky-500 bg-sky-50/20 opacity-40 shadow-xl"
          : isDropTarget
            ? "border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20 shadow-md"
            : "border-gray-200 bg-gray-50/70 hover:border-gray-300 hover:bg-white hover:shadow-2xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
        {/* Col 1: Drag handle + Serial */}
        <div className="flex sm:flex-col items-center justify-center gap-1 sm:w-12 shrink-0 sm:border-r sm:border-gray-200 sm:pr-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder member ${index + 1}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 cursor-grab active:cursor-grabbing transition"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-gray-500 sm:mt-0.5">
            #{index + 1}
          </span>
        </div>

        {/* Col 2: Circular 80px Photo */}
        <div className="flex items-center justify-center shrink-0 sm:w-24 sm:border-r sm:border-gray-200 sm:pr-3">
          <label
            htmlFor={photoInputId}
            className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow-xs bg-gray-100 transition hover:shadow-md shrink-0 flex items-center justify-center"
            title="Click to change photo"
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={item.fields.name || "Member photo"}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200/80 text-xl font-bold text-gray-600">
                {getInitials(item.fields.name || "")}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <input
              id={photoInputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
          </label>
        </div>

        {/* Col 3: Full Name + Designation */}
        <div className="flex flex-col gap-2 flex-1 sm:max-w-xs w-full">
          <input
            type="text"
            value={item.fields.name || ""}
            placeholder="Full Name"
            onChange={(e) => onUpdateField("name", e.target.value)}
            className="w-full h-9.5 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
          />
          <input
            type="text"
            value={item.fields.title || ""}
            placeholder="Designation"
            onChange={(e) => onUpdateField("title", e.target.value)}
            className="w-full h-9.5 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
          />
        </div>

        {/* Col 4: Bio */}
        <div className="flex-1 w-full min-w-0">
          <textarea
            rows={3}
            value={item.fields.bio || ""}
            placeholder="Bio..."
            onChange={(e) => onUpdateField("bio", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition resize-y"
          />
        </div>

        {/* Col 5: Red Delete Button */}
        <div className="flex items-center justify-end shrink-0 sm:pl-2">
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete member ${index + 1}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-xs cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableVideoCard({
  item,
  index: _index,
  thumbUrl,
  uploadedFile,
  onThumbChange,
  onVideoFileChange,
  onUpdateField,
  onDelete,
  onPreview,
  isDropTarget,
}: {
  item: EditableRow;
  index: number;
  thumbUrl: string;
  uploadedFile?: File;
  onThumbChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVideoFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateField: (field: string, value: string) => void;
  onDelete: () => void;
  onPreview: (preview: { title: string; url: string; isLocal: boolean }) => void;
  isDropTarget: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  const thumbInputId = `video-thumb-${item.id}`;
  const videoFileInputId = `video-file-${item.id}`;
  const source = item.fields.source || "url";
  const hasLocalVideo = Boolean(uploadedFile || item.fields.file_url);
  const hasYoutubeVideo = Boolean(source === "url" && item.fields.url);

  const handlePreviewClick = () => {
    if (source === "url" && item.fields.url) {
      onPreview({
        title: item.fields.title || "Video Preview",
        url: item.fields.url,
        isLocal: false,
      });
    } else if (source === "file") {
      const url = uploadedFile
        ? URL.createObjectURL(uploadedFile)
        : item.fields.file_url || "";
      if (url) {
        onPreview({
          title: item.fields.title || "Video Preview",
          url,
          isLocal: true,
        });
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={`flex flex-col rounded-xl border bg-white shadow-xs overflow-hidden transition-all duration-200 ${
        isDragging
          ? "border-sky-500 opacity-40 shadow-xl"
          : isDropTarget
            ? "border-sky-500 ring-2 ring-sky-500/20 shadow-md"
            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* 16:9 Thumbnail Area */}
      <div className="relative aspect-video w-full bg-gray-900 group overflow-hidden">
        {/* Floating Drag Handle top-left */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag video card"
          className="absolute top-0 left-0 z-10 flex h-7 w-7 items-center justify-center rounded-br-lg bg-black/60 text-white hover:bg-black/80 cursor-grab active:cursor-grabbing transition"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <label
          htmlFor={thumbInputId}
          className="relative block h-full w-full cursor-pointer"
          title="Click to change thumbnail"
        >
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={item.fields.title || "Video thumbnail"}
              fill
              unoptimized
              sizes="420px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500 text-xs font-semibold">
              No Thumbnail
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-7 w-7 text-white" />
          </div>
          <input
            id={thumbInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onThumbChange}
          />
        </label>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 bg-gray-50/60 gap-2.5">
        {/* Title */}
        <input
          type="text"
          value={item.fields.title || ""}
          placeholder="Video Title"
          onChange={(e) => onUpdateField("title", e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
        />

        {/* Video Source */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">
            Video Source:
          </label>
          <select
            value={source}
            onChange={(e) => onUpdateField("source", e.target.value)}
            className="w-full h-8.5 px-2.5 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
          >
            <option value="url">YouTube Embed URL</option>
            <option value="file">Local File Upload</option>
          </select>
        </div>

        {/* Source Inputs */}
        {source === "url" ? (
          <div>
            <input
              type="text"
              value={item.fields.url || ""}
              placeholder="Paste youtube embed link here"
              onChange={(e) => onUpdateField("url", e.target.value)}
              className="w-full h-8.5 px-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-700 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>
        ) : (
          <div>
            <div className="flex h-8.5 items-center overflow-hidden rounded-lg border border-gray-300 bg-white text-xs">
              <label
                htmlFor={videoFileInputId}
                className="inline-flex h-full shrink-0 cursor-pointer items-center border-r border-gray-300 bg-gray-100 px-3 font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Choose file
              </label>
              <span className="truncate px-2 text-gray-500">
                {uploadedFile?.name || (item.fields.file_url ? "Current video file" : "No file chosen")}
              </span>
            </div>
            <input
              id={videoFileInputId}
              type="file"
              accept=".mp4,.mov,.avi,.wmv,video/*"
              className="hidden"
              onChange={onVideoFileChange}
            />
          </div>
        )}

        {/* Card Footer */}
        <div className="mt-auto pt-2.5 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Remove
          </button>

          <div className="flex items-center">
            {source === "url" && item.fields.url && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                <Youtube className="h-3.5 w-3.5" /> YouTube
              </span>
            )}
            {source === "file" && (uploadedFile || item.fields.file_url) && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <FolderOpen className="h-3.5 w-3.5" /> Local
              </span>
            )}
          </div>

          {(hasYoutubeVideo || hasLocalVideo) && (
            <button
              type="button"
              onClick={handlePreviewClick}
              className="inline-flex items-center gap-1 rounded-full bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Play className="h-3 w-3 fill-white" /> View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableFaqItem({
  item,
  index,
  onUpdateField,
  onDelete,
  isDropTarget,
}: {
  item: EditableRow;
  index: number;
  onUpdateField: (field: string, value: string) => void;
  onDelete: () => void;
  isDropTarget: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
        isDragging
          ? "border-sky-500 opacity-40 shadow-xl"
          : isDropTarget
            ? "border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20 shadow-md"
            : "border-gray-200 bg-gray-50/70 hover:border-gray-300 hover:bg-white hover:shadow-2xs"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder FAQ ${index + 1}`}
            className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 cursor-grab active:cursor-grabbing transition"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-sky-600">
            Question #{index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete question ${index + 1}`}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-xs cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body Inputs */}
      <div className="space-y-2.5">
        <input
          type="text"
          value={item.fields.question || ""}
          placeholder="Enter Question"
          onChange={(e) => onUpdateField("question", e.target.value)}
          className="w-full h-9.5 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
        />
        <textarea
          rows={3}
          value={item.fields.answer || ""}
          placeholder="Enter Answer"
          onChange={(e) => onUpdateField("answer", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition resize-y"
        />
      </div>
    </div>
  );
}

function SortableInstitutionItem({
  item,
  index,
  logoUrl,
  onLogoChange,
  onUpdateField,
  onDelete,
  isDropTarget,
}: {
  item: EditableRow;
  index: number;
  logoUrl: string;
  onLogoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateField: (field: string, value: string) => void;
  onDelete: () => void;
  isDropTarget: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  const logoInputId = `institution-logo-${item.id}`;
  const isActive = item.fields.is_active !== "false";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={`rounded-xl border p-3 sm:p-3.5 transition-all duration-200 ${
        isDragging
          ? "border-sky-500 opacity-40 shadow-xl"
          : isDropTarget
            ? "border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20 shadow-md"
            : "border-gray-200 bg-gray-50/70 hover:border-gray-300 hover:bg-white hover:shadow-2xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
        {/* Col 1: Drag handle + Circle Serial Badge */}
        <div className="flex items-center justify-between sm:justify-center gap-3 sm:w-20 shrink-0 sm:border-r sm:border-gray-200 sm:pr-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder institution ${index + 1}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 cursor-grab active:cursor-grabbing transition"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-xs shrink-0 shadow-xs">
            {index + 1}
          </div>
        </div>

        {/* Col 2: Square 60px Logo Box */}
        <div className="flex items-center justify-center shrink-0 sm:w-20 sm:border-r sm:border-gray-200 sm:pr-3">
          <label
            htmlFor={logoInputId}
            className="group relative h-15 w-15 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xs transition hover:shadow-md shrink-0 flex items-center justify-center"
            title="Click to change logo"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={item.fields.name || "Institution logo"}
                fill
                unoptimized
                sizes="60px"
                className="object-contain p-1"
              />
            ) : (
              <Landmark className="h-6 w-6 text-gray-400" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <input
              id={logoInputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLogoChange}
            />
          </label>
        </div>

        {/* Col 3: Institution Name */}
        <div className="flex-1 w-full min-w-0">
          <label className="text-[11px] font-bold text-gray-500 block mb-1">
            Institution Name
          </label>
          <input
            type="text"
            value={item.fields.name || ""}
            placeholder="e.g. Stanford University"
            onChange={(e) => onUpdateField("name", e.target.value)}
            className="w-full h-9.5 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
          />
        </div>

        {/* Col 4: Status Toggle */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center shrink-0 px-1 sm:px-3">
          <label className="text-[11px] font-bold text-gray-500 block mb-1">
            Status
          </label>
          <CustomSwitch
            checked={isActive}
            onChange={(checked) => onUpdateField("is_active", String(checked))}
          />
        </div>

        {/* Col 5: Red Delete Button */}
        <div className="flex items-center justify-end shrink-0 sm:pl-2">
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete institution ${index + 1}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-xs cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContentPages() {
  const [slug, setSlug] = useState<AdminPageSlug>("about-us");
  const [activeSection, setActiveSection] = useState("who");
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const { currentData, isLoading, isError } = useGetAdminPageQuery(slug);
  const [updatePage, { isLoading: isSaving }] = useUpdateAdminPageMutation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coreValues, setCoreValues] = useState(defaultCoreValues);
  const [founder, setFounder] = useState(defaultFounder);
  const [structuredContent, setStructuredContent] = useState(
    defaultStructuredContent,
  );
  const [founderPhoto, setFounderPhoto] = useState<File | null>(null);
  const [founderPhotoPreview, setFounderPhotoPreview] = useState("");
  const [currentFounderPhoto, setCurrentFounderPhoto] = useState("");
  const [rowImageUploads, setRowImageUploads] = useState<
    Record<string, { file: File; preview: string }>
  >({});
  const [rowVideoUploads, setRowVideoUploads] = useState<Record<string, File>>({});
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    url: string;
    isLocal: boolean;
  } | null>(null);
  const [draggedRow, setDraggedRow] = useState<{
    key: StructuredKey;
    id: string;
    width: number;
    height: number;
  } | null>(null);
  const [dragOverRow, setDragOverRow] = useState<{ key: StructuredKey; id: string } | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!currentData?.data) return;
    setTitle(currentData.data.title ?? "");
    setContent(currentData.data.content ?? "");
    const values = currentData.data.core_values ?? {};
    setCoreValues({
      vision: String(values.vision ?? ""),
      mission: String(values.mission ?? ""),
      strategy: String(values.strategy ?? ""),
    });
    setFounder({
      name: String(currentData.data.founder?.name ?? ""),
      designation: String(currentData.data.founder?.designation ?? ""),
      bio: String(currentData.data.founder?.bio ?? ""),
      signature: String(currentData.data.founder?.signature ?? ""),
    });
    setCurrentFounderPhoto(
      String(
        currentData.data.founder?.photo_url ??
          currentData.data.founder?.image_url ??
          currentData.data.founder?.photo ??
          "",
      ),
    );
    setFounderPhoto(null);
    setFounderPhotoPreview("");
    setRowImageUploads((current) => {
      Object.values(current).forEach(({ preview }) => URL.revokeObjectURL(preview));
      return {};
    });
    setRowVideoUploads({});
    setStructuredContent({
      team: toTeamEditableRows(currentData.data.team),
      videos: toVideoEditableRows(currentData.data.videos),
      faqs: toEditableRows(currentData.data.faqs, defaultRowFields.faqs),
      leading_institutions: toInstitutionEditableRows(
        currentData.data.leading_institutions,
      ),
    });
  }, [currentData]);

  useEffect(() => {
    return () => {
      if (founderPhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(founderPhotoPreview);
      }
    };
  }, [founderPhotoPreview]);

  useEffect(() => {
    return () => {
      Object.values(rowImageUploads).forEach(({ preview }) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [rowImageUploads]);

  const handleFounderPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Founder photo must be smaller than 5 MB");
      return;
    }

    setFounderPhoto(file);
    setFounderPhotoPreview(URL.createObjectURL(file));
  };

  const handleRowImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    rowId: string,
    field: string,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Choose an image file (PNG, JPG, WEBP, or SVG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Images must be smaller than 5 MB");
      return;
    }

    const key = `${rowId}:${field}`;
    const preview = URL.createObjectURL(file);
    setRowImageUploads((current) => {
      const existing = current[key];
      if (existing) URL.revokeObjectURL(existing.preview);
      return { ...current, [key]: { file, preview } };
    });
  };

  const handleVideoFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    rowId: string,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const allowedType = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
    ].includes(file.type);
    const allowedExtension = /\.(mp4|mov|avi|wmv)$/i.test(file.name);
    if (!allowedType && !allowedExtension) {
      toast.error("Choose an MP4, MOV, AVI, or WMV video");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video files must be smaller than 100 MB");
      return;
    }
    setRowVideoUploads((current) => ({ ...current, [`${rowId}:file`]: file }));
  };

  const moveRow = (key: StructuredKey, from: number, to: number) => {
    if (from === to) return;
    setStructuredContent((current) => {
      const rows = [...current[key]];
      if (to < 0 || to >= rows.length || from === to) return current;
      return { ...current, [key]: arrayMove(rows, from, to) };
    });
  };

  const finishReordering = (key: StructuredKey, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStructuredContent((current) => {
        const rows = current[key];
        const from = rows.findIndex((row) => row.id === active.id);
        const to = rows.findIndex((row) => row.id === over.id);
        return from < 0 || to < 0
          ? current
          : { ...current, [key]: arrayMove(rows, from, to) };
      });
    }
    setDraggedRow(null);
    setDragOverRow(null);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const body: Record<string, unknown> = { title, content };
      if (slug === "about-us") {
        body.vision = coreValues.vision;
        body.mission = coreValues.mission;
        body.strategy = coreValues.strategy;
        body.founder_name = founder.name;
        body.founder_designation = founder.designation;
        body.founder_bio = founder.bio;
        body.founder_signature = founder.signature;
        const uploadedIds = (key: StructuredKey) =>
          new Set(
            [...Object.keys(rowImageUploads), ...Object.keys(rowVideoUploads)]
              .map((uploadKey) => uploadKey.split(":")[0])
              .filter((id) => structuredContent[key].some((row) => row.id === id)),
          );
        body.team = toApiRows(structuredContent.team, uploadedIds("team")).map(
          (member) => {
            const { photo_url: _photoUrl, ...payload } = member;
            return payload;
          },
        );
        body.videos = toApiRows(structuredContent.videos, uploadedIds("videos"));
        body.faqs = toApiRows(structuredContent.faqs, uploadedIds("faqs"));
        body.leading_institutions = toApiRows(
          structuredContent.leading_institutions,
          uploadedIds("leading_institutions"),
        ).map((institution) => {
          const { logo_url: _logoUrl, ...payload } = institution;
          return {
            ...payload,
            is_active: payload.is_active !== "false" && payload.is_active !== false,
          };
        });
      }

      const queuedUploads = [
        ...Object.entries(rowImageUploads).map(([key, upload]) => ({ key, file: upload.file })),
        ...Object.entries(rowVideoUploads).map(([key, file]) => ({ key, file })),
      ];
      const queuedUploadKeys = queuedUploads.map(({ key }) => key);
      const uploads = queuedUploads.flatMap(({ key, file }) => {
        const [rowId, field] = key.split(":");
        const section = (Object.keys(structuredContent) as StructuredKey[]).find((name) =>
          structuredContent[name].some((row) => row.id === rowId),
        );
        if (!section) return [];
        const sectionUploads = new Set(
          queuedUploadKeys
            .map((uploadKey) => uploadKey.split(":")[0])
            .filter((id) => structuredContent[section].some((row) => row.id === id)),
        );
        const savedRows = structuredContent[section].filter(
          (row) => sectionUploads.has(row.id) || Object.values(row.fields).some((value) => value.trim()),
        );
        const index = savedRows.findIndex((row) => row.id === rowId);
        if (index < 0) return [];
        // The API exposes display URLs but accepts uploaded files in separate fields.
        const apiField =
          section === "team" && field === "photo_url"
            ? "photo"
            : section === "videos" && field === "thumbnail_url"
              ? "thumbnail"
              : section === "leading_institutions" && field === "logo_url"
                ? "logo"
                : field;
        return [{ fieldName: `${section}[${index}][${apiField}]`, file }];
      });

      await updatePage({
        slug,
        body: body as { title: string; content: string },
        ...(slug === "about-us" && founderPhoto ? { founderPhoto } : {}),
        ...(uploads.length ? { uploads } : {}),
      }).unwrap();
      toast.success("Page content saved successfully");
    } catch {
      toast.error("Could not save page content. Please review the fields and try again.");
    }
  };

  const currentPage = pages.find((page) => page.slug === slug)!;
  const sectionConfig: Record<
    StructuredKey,
    {
      title: string;
      subtitle: string;
      hasInfoIcon: boolean;
      addButtonText: string;
      emptyText: string;
      icon: typeof UsersRound;
    }
  > = {
    team: {
      title: "3. Team Management",
      subtitle: "Member photo size must be less than 5MB",
      hasInfoIcon: true,
      addButtonText: "+ Add Member",
      emptyText: "No team members added yet",
      icon: UsersRound,
    },
    videos: {
      title: "4. Tutorial Videos",
      subtitle: "Uploaded video size must be less than 100MB",
      hasInfoIcon: true,
      addButtonText: "+ Add Video Card",
      emptyText: "No videos added yet",
      icon: Clapperboard,
    },
    faqs: {
      title: "5. Frequently Asked Questions",
      subtitle: "Manage the FAQ section for this page.",
      hasInfoIcon: false,
      addButtonText: "+ Add FAQ",
      emptyText: "No FAQ questions added yet",
      icon: CircleHelp,
    },
    leading_institutions: {
      title: "6. Leading Institutions Management",
      subtitle: "Drag items using the grip icon to change their display order.",
      hasInfoIcon: false,
      addButtonText: "+ Add New Institution",
      emptyText: "No institutions added yet",
      icon: Landmark,
    },
  };

  const renderStructuredEditor = (
    key: StructuredKey,
    _label?: string,
    _description?: string,
    _number?: string,
  ) => {
    const cfg = sectionConfig[key];
    const items = structuredContent[key];
    const IconComponent = cfg.icon;

    const updateField = (index: number, field: string, value: string) => {
      setStructuredContent((current) => ({
        ...current,
        [key]: current[key].map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, fields: { ...item.fields, [field]: value } }
            : item,
        ),
      }));
    };

    const handleAddItem = () => {
      setStructuredContent((current) => ({
        ...current,
        [key]: [
          ...current[key],
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            original: {},
            fields: Object.fromEntries(
              defaultRowFields[key].map((field) => [
                field,
                key === "videos" && field === "source"
                  ? "url"
                  : key === "leading_institutions" && field === "is_active"
                    ? "true"
                    : "",
              ]),
            ),
          },
        ],
      }));
    };

    const handleDeleteRow = (index: number, rowId: string) => {
      const rowUploads = Object.entries(rowImageUploads).filter(([uk]) =>
        uk.startsWith(`${rowId}:`),
      );
      rowUploads.forEach(([, upload]) => URL.revokeObjectURL(upload.preview));
      setRowImageUploads((current) => {
        const next = { ...current };
        rowUploads.forEach(([uk]) => delete next[uk]);
        return next;
      });
      setRowVideoUploads((current) => {
        const next = { ...current };
        delete next[`${rowId}:file`];
        return next;
      });
      setStructuredContent((current) => ({
        ...current,
        [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
      }));
    };

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              {cfg.title}
            </h2>
            <p className="mt-1 flex items-center text-xs text-gray-500">
              {cfg.hasInfoIcon && (
                <Info className="mr-1 h-3.5 w-3.5 text-sky-500 shrink-0" />
              )}
              {cfg.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-500 px-4 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-50 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            {cfg.addButtonText.replace(/^\+\s*/, "")}
          </button>
        </div>

        <div>
          {items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200 text-sky-600 shadow-xs">
                <IconComponent className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-gray-800">{cfg.emptyText}</p>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Add your first entry to display this section on the public About Us page.
              </p>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-sky-500 bg-sky-50/50 px-4 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-500 hover:text-white transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {cfg.addButtonText.replace(/^\+\s*/, "")}
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={({ active }) => {
                const rect = active.rect.current.initial;
                setDraggedRow({
                  key,
                  id: String(active.id),
                  width: rect?.width ?? 0,
                  height: rect?.height ?? 0,
                });
                setDragOverRow(null);
              }}
              onDragOver={({ over }) => {
                const id = over ? String(over.id) : "";
                setDragOverRow((current) =>
                  current?.key === key && current.id === id
                    ? current
                    : id
                      ? { key, id }
                      : null,
                );
              }}
              onDragEnd={(event) => finishReordering(key, event)}
              onDragCancel={() => {
                setDraggedRow(null);
                setDragOverRow(null);
              }}
            >
              {key === "videos" ? (
                <SortableContext
                  items={items.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item, index) => {
                      const thumbUploadKey = `${item.id}:thumbnail_url`;
                      const thumbUrl =
                        rowImageUploads[thumbUploadKey]?.preview ||
                        item.fields.thumbnail_url ||
                        "";
                      const uploadedVideo = rowVideoUploads[`${item.id}:file`];
                      return (
                        <SortableVideoCard
                          key={item.id}
                          item={item}
                          index={index}
                          thumbUrl={thumbUrl}
                          uploadedFile={uploadedVideo}
                          onThumbChange={(e) =>
                            handleRowImageChange(e, item.id, "thumbnail_url")
                          }
                          onVideoFileChange={(e) => handleVideoFileChange(e, item.id)}
                          onUpdateField={(field, val) =>
                            updateField(index, field, val)
                          }
                          onDelete={() => handleDeleteRow(index, item.id)}
                          onPreview={(preview) => setPreviewVideo(preview)}
                          isDropTarget={
                            dragOverRow?.key === key && dragOverRow.id === item.id
                          }
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              ) : (
                <SortableContext
                  items={items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      if (key === "team") {
                        const uploadKey = `${item.id}:photo_url`;
                        const photoUrl =
                          rowImageUploads[uploadKey]?.preview ||
                          item.fields.photo_url ||
                          "";
                        return (
                          <SortableTeamItem
                            key={item.id}
                            item={item}
                            index={index}
                            photoUrl={photoUrl}
                            onPhotoChange={(e) =>
                              handleRowImageChange(e, item.id, "photo_url")
                            }
                            onUpdateField={(field, val) =>
                              updateField(index, field, val)
                            }
                            onDelete={() => handleDeleteRow(index, item.id)}
                            isDropTarget={
                              dragOverRow?.key === key &&
                              dragOverRow.id === item.id
                            }
                          />
                        );
                      }

                      if (key === "faqs") {
                        return (
                          <SortableFaqItem
                            key={item.id}
                            item={item}
                            index={index}
                            onUpdateField={(field, val) =>
                              updateField(index, field, val)
                            }
                            onDelete={() => handleDeleteRow(index, item.id)}
                            isDropTarget={
                              dragOverRow?.key === key &&
                              dragOverRow.id === item.id
                            }
                          />
                        );
                      }

                      // leading_institutions
                      const logoUploadKey = `${item.id}:logo_url`;
                      const logoUrl =
                        rowImageUploads[logoUploadKey]?.preview ||
                        item.fields.logo_url ||
                        "";
                      return (
                        <SortableInstitutionItem
                          key={item.id}
                          item={item}
                          index={index}
                          logoUrl={logoUrl}
                          onLogoChange={(e) =>
                            handleRowImageChange(e, item.id, "logo_url")
                          }
                          onUpdateField={(field, val) =>
                            updateField(index, field, val)
                          }
                          onDelete={() => handleDeleteRow(index, item.id)}
                          isDropTarget={
                            dragOverRow?.key === key &&
                            dragOverRow.id === item.id
                          }
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              )}

              <DragOverlay
                adjustScale={false}
                dropAnimation={{
                  duration: 200,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: { active: { opacity: "0" } },
                  }),
                }}
              >
                {draggedRow?.key === key && (() => {
                  const item = items.find((row) => row.id === draggedRow.id);
                  if (!item) return null;
                  const itemIndex = items.findIndex((row) => row.id === item.id);

                  if (key === "team") {
                    const uploadKey = `${item.id}:photo_url`;
                    const photoUrl =
                      rowImageUploads[uploadKey]?.preview ||
                      item.fields.photo_url ||
                      "";
                    return (
                      <div
                        style={{ width: draggedRow.width || undefined }}
                        className="rounded-xl border-2 border-sky-500 bg-white p-3.5 shadow-2xl ring-4 ring-sky-500/10 pointer-events-none"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="flex flex-col items-center justify-center gap-1 w-12 shrink-0 border-r border-gray-200 pr-3">
                            <GripVertical className="h-5 w-5 text-sky-500" />
                            <span className="text-xs font-bold text-gray-500">
                              #{itemIndex + 1}
                            </span>
                          </div>
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                            {photoUrl ? (
                              <Image
                                src={photoUrl}
                                alt=""
                                fill
                                unoptimized
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">
                                {getInitials(item.fields.name || "")}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {item.fields.name || `Member #${itemIndex + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.fields.title || "No designation"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (key === "videos") {
                    const thumbUploadKey = `${item.id}:thumbnail_url`;
                    const thumbUrl =
                      rowImageUploads[thumbUploadKey]?.preview ||
                      item.fields.thumbnail_url ||
                      "";
                    return (
                      <div
                        style={{ width: draggedRow.width || 320 }}
                        className="rounded-xl border-2 border-sky-500 bg-white overflow-hidden shadow-2xl ring-4 ring-sky-500/10 pointer-events-none"
                      >
                        <div className="relative aspect-video w-full bg-gray-900">
                          {thumbUrl && (
                            <Image
                              src={thumbUrl}
                              alt=""
                              fill
                              unoptimized
                              sizes="320px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {item.fields.title || `Video #${itemIndex + 1}`}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (key === "faqs") {
                    return (
                      <div
                        style={{ width: draggedRow.width || undefined }}
                        className="rounded-xl border-2 border-sky-500 bg-white p-4 shadow-2xl ring-4 ring-sky-500/10 pointer-events-none"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <GripVertical className="h-4 w-4 text-sky-500" />
                          <span className="text-sm font-bold text-sky-600">
                            Question #{itemIndex + 1}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.fields.question || "Empty Question"}
                        </p>
                      </div>
                    );
                  }

                  // leading_institutions
                  const logoUploadKey = `${item.id}:logo_url`;
                  const logoUrl =
                    rowImageUploads[logoUploadKey]?.preview ||
                    item.fields.logo_url ||
                    "";
                  return (
                    <div
                      style={{ width: draggedRow.width || undefined }}
                      className="rounded-xl border-2 border-sky-500 bg-white p-3 shadow-2xl ring-4 ring-sky-500/10 pointer-events-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                          <GripVertical className="h-5 w-5 text-sky-500" />
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-xs">
                            {itemIndex + 1}
                          </div>
                        </div>
                        <div className="relative h-12 w-12 rounded-lg border border-gray-200 bg-white p-1 shrink-0 flex items-center justify-center">
                          {logoUrl ? (
                            <Image
                              src={logoUrl}
                              alt=""
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <Landmark className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {item.fields.name || `Institution #${itemIndex + 1}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={save} className="space-y-6 pb-8">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Edit {currentPage.label}
            </h1>
            <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-mono font-medium text-gray-600">
              /{slug}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Manage and update the public content displayed on the {currentPage.label.toLowerCase()} page.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving || isLoading || isError}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primaryColor px-6 text-sm font-semibold text-white shadow-xs transition hover:bg-primaryColor/90 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes…</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </header>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid min-h-[620px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-3 shadow-xs">
          <h2 className="px-0 pb-2 text-xs font-semibold text-gray-500">
            Pages
          </h2>
          <nav aria-label="Content pages" className="space-y-1">
            {pages.map((page) => {
              const Icon = page.icon;
              const isAboutUs = page.slug === "about-us";
              const isPageActive = slug === page.slug;

              return (
                <div key={page.slug} className="space-y-1">
                  <div
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition ${
                      isPageActive
                        ? isAboutUs
                          ? "bg-gray-50/90 text-gray-900 font-semibold border border-gray-200/80 shadow-2xs"
                          : "bg-primaryColor/10 text-primaryColor font-semibold border border-primaryColor/20 shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(page.slug);
                        if (isAboutUs) {
                          setIsAboutExpanded(true);
                          if (slug !== "about-us") {
                            setActiveSection("who");
                          }
                        }
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left cursor-pointer"
                      aria-current={isPageActive ? "page" : undefined}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition ${
                          isPageActive
                            ? "text-primaryColor"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span className="truncate">{page.label}</span>
                    </button>

                    {isAboutUs && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (slug !== "about-us") {
                            setSlug("about-us");
                            setIsAboutExpanded(true);
                            setActiveSection("who");
                          } else {
                            setIsAboutExpanded((prev) => !prev);
                          }
                        }}
                        aria-label={
                          isAboutExpanded
                            ? "Collapse About Us sections"
                            : "Expand About Us sections"
                        }
                        title={
                          isAboutExpanded
                            ? "Collapse sections"
                            : "Expand sections"
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition cursor-pointer"
                      >
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isAboutExpanded && isPageActive
                              ? "rotate-0 text-primaryColor"
                              : "-rotate-90 text-gray-400"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Nested Sub-menu for About Us sections */}
                  {isAboutUs && isPageActive && isAboutExpanded && (
                    <div
                      aria-label="About Us sections"
                      className="ml-4 pl-2.5 border-l-2 border-primaryColor/25 space-y-1 py-1"
                    >
                      {aboutSections.map((section) => {
                        const SectionIcon = section.icon;
                        const count =
                          "key" in section
                            ? getArrayLength(structuredContent[section.key])
                            : null;
                        const isSectionActive = activeSection === section.id;

                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            aria-current={isSectionActive ? "page" : undefined}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] font-medium transition cursor-pointer ${
                              isSectionActive
                                ? "bg-primaryColor/10 text-primaryColor font-semibold border border-primaryColor/25 shadow-xs"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <SectionIcon
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  isSectionActive
                                    ? "text-primaryColor"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="truncate">{section.label}</span>
                            </span>
                            {count !== null && (
                              <span
                                className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition ${
                                  isSectionActive
                                    ? "bg-primaryColor text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-primaryColor" />
                <span>Loading page content…</span>
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-sm text-red-700 shadow-xs">
              Page content could not be loaded. Please refresh or try again later.
            </div>
          ) : slug !== "about-us" ? (
            <SectionHeading
              number="1"
              title={`${currentPage.label} Content`}
              description="Update the page title and detailed legal/policy content shown to visitors."
            >
              <div className="space-y-5">
                <CustomInput
                  label="Page Title"
                  required
                  maxLength={255}
                  value={title}
                  placeholder="e.g. Terms & Conditions"
                  onChange={(event) => setTitle(event.target.value)}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Page Content
                  </label>
                  <JoditEditor
                    value={content}
                    onChange={setContent}
                    placeholder={`Write the ${currentPage.label.toLowerCase()} content...`}
                    height={520}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Use the rich-text toolbar to format headings, paragraphs, lists, and links.
                  </p>
                </div>
              </div>
            </SectionHeading>
          ) : activeSection === "who" ? (
            <div className="space-y-5">
              {/* Founder Profile */}
              <SectionHeading
                number="1"
                title="Founder Profile"
                description="Manage the founder photo, biography, and signature shown on the About Us page."
              >
                <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
                  {/* Photo Uploader */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50/70 p-6 text-center">
                    <div className="relative mb-3 h-44 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
                      <Image
                        src={
                          founderPhotoPreview ||
                          currentFounderPhoto ||
                          "/empty_user.jpg"
                        }
                        alt="Founder portrait preview"
                        fill
                        unoptimized
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-gray-800">Founder Photo</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">JPG or PNG, up to 5 MB</p>
                    <CustomInput
                      id="founder-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFounderPhotoChange}
                      containerClassName="hidden"
                    />
                    <label
                      htmlFor="founder-photo-upload"
                      className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-primaryColor/30 bg-primaryColor/5 px-4 py-2 text-xs font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Change Photo
                    </label>
                  </div>

                  {/* Form fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <CustomInput
                      label="Founder Name"
                      value={founder.name}
                      placeholder="e.g. Vanni Intini"
                      onChange={(event) =>
                        setFounder((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                    <CustomInput
                      label="Designation"
                      value={founder.designation}
                      placeholder="e.g. Founder & CEO of Mind Unite"
                      onChange={(event) =>
                        setFounder((current) => ({
                          ...current,
                          designation: event.target.value,
                        }))
                      }
                    />
                    <CustomTextArea
                      label="Biography / Intro Text"
                      rows={5}
                      value={founder.bio}
                      placeholder="Share the founder's background, journey, and mission..."
                      onChange={(event) =>
                        setFounder((current) => ({
                          ...current,
                          bio: event.target.value,
                        }))
                      }
                      containerClassName="md:col-span-2"
                    />
                    <div className="grid items-end gap-3 md:col-span-2 md:grid-cols-[minmax(0,1fr)_200px]">
                      <CustomInput
                        label="Signature Text"
                        value={founder.signature}
                        placeholder="e.g. Vanni Intini"
                        onChange={(event) =>
                          setFounder((current) => ({
                            ...current,
                            signature: event.target.value,
                          }))
                        }
                      />
                      <div>
                        <span className="mb-1.5 block text-xs font-medium text-gray-500">
                          Signature Preview
                        </span>
                        <div
                          aria-label={`Signature preview: ${founder.signature || "empty"}`}
                          className="flex h-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 px-3 shadow-xs"
                        >
                          <span className="font-great-vibes whitespace-nowrap text-2xl text-gray-700">
                            {founder.signature || "Signature"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionHeading>

              {/* Core Values */}
              <SectionHeading
                number="2"
                title="Core Values"
                description="Manage the vision, mission, and strategy displayed on the About Us page."
              >
                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-emerald-50/40 to-white p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <Eye className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">Our Vision</h3>
                    </div>
                    <CustomTextArea
                      rows={6}
                      value={coreValues.vision}
                      placeholder="Describe the long-term vision..."
                      onChange={(event) =>
                        setCoreValues((current) => ({
                          ...current,
                          vision: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-sky-50/40 to-white p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                        <Compass className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">Our Mission</h3>
                    </div>
                    <CustomTextArea
                      rows={6}
                      value={coreValues.mission}
                      placeholder="Describe the mission and daily purpose..."
                      onChange={(event) =>
                        setCoreValues((current) => ({
                          ...current,
                          mission: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-amber-50/40 to-white p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">Our Strategy</h3>
                    </div>
                    <CustomTextArea
                      rows={6}
                      value={coreValues.strategy}
                      placeholder="Describe the core strategy and approach..."
                      onChange={(event) =>
                        setCoreValues((current) => ({
                          ...current,
                          strategy: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </SectionHeading>
            </div>
          ) : activeSection === "team" ? (
            renderStructuredEditor(
              "team",
              "Meet The Team",
              "Manage the team member profiles displayed on the About Us page.",
              "3",
            )
          ) : activeSection === "features" ? (
            renderStructuredEditor(
              "videos",
              "Key Features & Videos",
              "Manage feature videos and their display information on the About Us page.",
              "4",
            )
          ) : activeSection === "faqs" ? (
            renderStructuredEditor(
              "faqs",
              "FAQ Management",
              "Manage the questions and answers shown in the FAQ section.",
              "5",
            )
          ) : (
            renderStructuredEditor(
              "leading_institutions",
              "Leading Institutions",
              "Manage the institution and partner entries shown on the About Us page.",
              "6",
            )
          )}
        </main>
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-sky-600 px-4 py-2.5 text-white">
              <h4 className="text-sm font-bold truncate">
                {previewVideo.title || "Video Preview"}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                aria-label="Close video preview"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {previewVideo.isLocal ? (
                <video
                  src={previewVideo.url}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(previewVideo.url)}
                  title={previewVideo.title || "Video Preview"}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
