"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
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
  CircleHelp,
  Clapperboard,
  ArrowDown,
  ArrowUp,
  Compass,
  Eye,
  FileText,
  GripVertical,
  Landmark,
  Lightbulb,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  Upload,
  UsersRound,
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
  leading_institutions: ["name", "website", "description", "logo_url"],
};

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

function SortableCard({
  id,
  index,
  title,
  subtitle,
  children,
  isDropTarget,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: {
  id: string;
  index: number;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  isDropTarget: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 240,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={`group rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 ${
        isDragging
          ? "border-primaryColor opacity-40 shadow-xl"
          : isDropTarget
            ? "border-primaryColor bg-emerald-50/30 ring-2 ring-primaryColor/20 shadow-md"
            : "border-gray-200/90 hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      {/* Card Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder entry ${index + 1}`}
            title="Drag to reorder"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-grab active:cursor-grabbing transition"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="flex h-6 items-center px-2 rounded-md bg-gray-100 font-bold text-xs text-gray-700">
            #{index + 1}
          </span>
          <div className="min-w-0 truncate">
            <span className="font-semibold text-sm text-gray-900 truncate block">
              {title || `Entry #${index + 1}`}
            </span>
            {subtitle && (
              <span className="text-[11px] text-gray-400 truncate block">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50/50 p-0.5">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label={`Move ${index + 1} up`}
              title="Move up"
              className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              aria-label={`Move ${index + 1} down`}
              title="Move down"
              className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Remove entry ${index + 1}`}
            title="Delete entry"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      {children}
    </article>
  );
}

export default function ContentPages() {
  const [slug, setSlug] = useState<AdminPageSlug>("about-us");
  const [activeSection, setActiveSection] = useState("who");
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
          return payload;
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
  const renderStructuredEditor = (
    key: StructuredKey,
    label: string,
    description: string,
    number: string,
  ) => {
    const items = structuredContent[key];
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
    const imageField = (item: EditableRow) =>
      Object.keys(item.fields).find((field) =>
        /(photo_url|logo_url|thumbnail_url|photo|image|avatar|logo|thumbnail)/i.test(field),
      );

    const isInstitution = key === "leading_institutions";
    const isTeam = key === "team";

    return (
      <SectionHeading
        number={number}
        title={label}
        description={description}
        badge={`${items.length} ${items.length === 1 ? "entry" : "entries"}`}
        actions={
          <button
            type="button"
            onClick={() =>
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
                        key === "videos" && field === "source" ? "url" : "",
                      ]),
                    ),
                  },
                ],
              }))
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-primaryColor px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primaryColor/90 focus:ring-2 focus:ring-primaryColor/20"
          >
            <Plus className="h-4 w-4" />
            Add {isTeam ? "Member" : key === "faqs" ? "Question" : isInstitution ? "Institution" : "Entry"}
          </button>
        }
      >
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-400 shadow-xs">
                {isInstitution ? (
                  <Landmark className="h-6 w-6 text-primaryColor" />
                ) : isTeam ? (
                  <UsersRound className="h-6 w-6 text-primaryColor" />
                ) : key === "videos" ? (
                  <Clapperboard className="h-6 w-6 text-primaryColor" />
                ) : (
                  <CircleHelp className="h-6 w-6 text-primaryColor" />
                )}
              </div>
              <p className="mt-3 text-sm font-bold text-gray-800">No {label.toLowerCase()} added yet</p>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Add your first entry to display this section on the public About Us page.
              </p>
              <button
                type="button"
                onClick={() =>
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
                            key === "videos" && field === "source" ? "url" : "",
                          ]),
                        ),
                      },
                    ],
                  }))
                }
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-primaryColor/30 bg-primaryColor/5 px-4 py-2 text-xs font-semibold text-primaryColor hover:bg-primaryColor hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Entry
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
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const photoField = imageField(item);
                    const uploadKey = photoField ? `${item.id}:${photoField}` : "";
                    const photoUrl = photoField
                      ? rowImageUploads[uploadKey]?.preview || item.fields[photoField]
                      : "";
                    const fields = Object.entries(item.fields).filter(
                      ([field]) =>
                        field !== photoField &&
                        !(key === "videos" && ["source", "url", "file_url", "type"].includes(field)),
                    );

                    const itemTitle =
                      item.fields.name ||
                      item.fields.title ||
                      item.fields.question ||
                      `${isInstitution ? "Institution" : isTeam ? "Member" : "Entry"} #${index + 1}`;
                    const itemSubtitle = isInstitution
                      ? item.fields.website
                      : isTeam
                        ? item.fields.title
                        : undefined;

                    const handleDeleteRow = () => {
                      const rowUploads = Object.entries(rowImageUploads).filter(([uk]) =>
                        uk.startsWith(`${item.id}:`),
                      );
                      rowUploads.forEach(([, upload]) => URL.revokeObjectURL(upload.preview));
                      setRowImageUploads((current) => {
                        const next = { ...current };
                        rowUploads.forEach(([uk]) => delete next[uk]);
                        return next;
                      });
                      setRowVideoUploads((current) => {
                        const next = { ...current };
                        delete next[`${item.id}:file`];
                        return next;
                      });
                      setStructuredContent((current) => ({
                        ...current,
                        [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
                      }));
                    };

                    return (
                      <SortableCard
                        key={item.id}
                        id={item.id}
                        index={index}
                        title={itemTitle}
                        subtitle={itemSubtitle}
                        isDropTarget={dragOverRow?.key === key && dragOverRow.id === item.id}
                        onMoveUp={() => moveRow(key, index, index - 1)}
                        onMoveDown={() => moveRow(key, index, index + 1)}
                        onDelete={handleDeleteRow}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                      >
                        {photoField ? (
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-start pt-1">
                            {/* Image / Logo Upload Box */}
                            <div className="flex flex-col items-center sm:items-start shrink-0">
                              <div
                                className={`relative h-24 w-24 overflow-hidden border border-gray-200 bg-gray-50/80 shadow-xs ${
                                  isTeam ? "rounded-full" : "rounded-2xl p-2"
                                }`}
                              >
                                {photoUrl ? (
                                  <Image
                                    src={photoUrl}
                                    alt={`${item.fields.name || label} image`}
                                    fill
                                    unoptimized
                                    sizes="96px"
                                    className={isTeam ? "object-cover" : "object-contain p-1.5"}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-bold text-gray-400">
                                    {(item.fields.name || "?").slice(0, 1).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <label
                                htmlFor={`row-image-${item.id}`}
                                className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primaryColor hover:underline"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                {photoUrl
                                  ? isInstitution
                                    ? "Change logo"
                                    : "Change photo"
                                  : isInstitution
                                    ? "Upload logo"
                                    : "Upload photo"}
                              </label>
                              <span className="mt-0.5 text-[11px] text-gray-400">
                                JPG, PNG, WEBP (max 5MB)
                              </span>
                              <CustomInput
                                id={`row-image-${item.id}`}
                                type="file"
                                accept="image/*"
                                containerClassName="hidden"
                                onChange={(event) =>
                                  handleRowImageChange(event, item.id, photoField)
                                }
                              />
                            </div>

                            {/* Form Inputs Grid */}
                            <div className="grid flex-1 min-w-0 gap-3 md:grid-cols-2">
                              {fields.map(([field, value]) => {
                                const fieldLabel = field
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (letter) => letter.toUpperCase());
                                const longText = /(bio|description|answer|content)/i.test(field);
                                return longText ? (
                                  <CustomTextArea
                                    key={field}
                                    label={fieldLabel}
                                    rows={3}
                                    value={value}
                                    placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                                    onChange={(event) =>
                                      updateField(index, field, event.target.value)
                                    }
                                    containerClassName="md:col-span-2"
                                  />
                                ) : (
                                  <CustomInput
                                    key={field}
                                    label={fieldLabel}
                                    value={value}
                                    placeholder={
                                      field === "website"
                                        ? "https://..."
                                        : `Enter ${fieldLabel.toLowerCase()}...`
                                    }
                                    onChange={(event) =>
                                      updateField(index, field, event.target.value)
                                    }
                                    containerClassName={
                                      fields.length === 1 ? "md:col-span-2" : ""
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="grid min-w-0 gap-3 md:grid-cols-2 pt-1">
                            {fields.map(([field, value]) => {
                              const fieldLabel = field
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (letter) => letter.toUpperCase());
                              const longText = /(bio|description|answer|content)/i.test(field);
                              return longText ? (
                                <CustomTextArea
                                  key={field}
                                  label={fieldLabel}
                                  rows={3}
                                  value={value}
                                  placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                                  onChange={(event) =>
                                    updateField(index, field, event.target.value)
                                  }
                                  containerClassName="md:col-span-2"
                                />
                              ) : (
                                <CustomInput
                                  key={field}
                                  label={fieldLabel}
                                  value={value}
                                  placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                                  onChange={(event) =>
                                    updateField(index, field, event.target.value)
                                  }
                                  containerClassName={
                                    fields.length === 1 || key === "faqs" ? "md:col-span-2" : ""
                                  }
                                />
                              );
                            })}

                            {key === "videos" && (
                              <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                                <AdminSelect
                                  id={`video-source-${item.id}`}
                                  label="Video Source"
                                  value={item.fields.source || "url"}
                                  onChange={(event) => {
                                    updateField(index, "source", event.target.value);
                                    if (event.target.value === "url") {
                                      setRowVideoUploads((current) => {
                                        const next = { ...current };
                                        delete next[`${item.id}:file`];
                                        return next;
                                      });
                                    }
                                  }}
                                >
                                  <option value="url">YouTube Embed URL</option>
                                  <option value="file">Local File Upload</option>
                                </AdminSelect>
                                {item.fields.source === "url" || !item.fields.source ? (
                                  <CustomInput
                                    label="YouTube URL"
                                    value={item.fields.url || ""}
                                    placeholder="https://www.youtube.com/embed/..."
                                    onChange={(event) =>
                                      updateField(index, "url", event.target.value)
                                    }
                                  />
                                ) : (
                                  <div>
                                    <label
                                      htmlFor={`video-file-${item.id}`}
                                      className="mb-1.5 block text-sm font-medium text-[#4A4C56]"
                                    >
                                      Video File
                                    </label>
                                    <div className="flex h-10 min-w-0 items-center overflow-hidden rounded-lg border border-gray-300 bg-white text-sm focus-within:border-primaryColor focus-within:ring-2 focus-within:ring-primaryColor/15">
                                      <label
                                        htmlFor={`video-file-${item.id}`}
                                        className="inline-flex h-full shrink-0 cursor-pointer items-center gap-2 border-r border-gray-300 bg-gray-50 px-3 font-medium text-gray-700 transition hover:bg-gray-100"
                                      >
                                        <Upload className="h-4 w-4 text-primaryColor" />
                                        Choose file
                                      </label>
                                      <span className="truncate px-3 text-gray-600">
                                        {rowVideoUploads[`${item.id}:file`]?.name ||
                                          "No file selected"}
                                      </span>
                                    </div>
                                    <CustomInput
                                      id={`video-file-${item.id}`}
                                      type="file"
                                      accept=".mp4,.mov,.avi,.wmv,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                                      onChange={(event) =>
                                        handleVideoFileChange(event, item.id)
                                      }
                                      containerClassName="sr-only"
                                      className="sr-only"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </SortableCard>
                    );
                  })}
                  <div
                    className={`h-3 rounded-lg border-2 border-dashed transition-colors ${
                      dragOverRow?.key === key && dragOverRow.id === "__end__"
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-transparent"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </SortableContext>
              <DragOverlay
                adjustScale={false}
                dropAnimation={{
                  duration: 260,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: { active: { opacity: "0" } },
                  }),
                }}
              >
                {draggedRow?.key === key && (() => {
                  const item = items.find((row) => row.id === draggedRow.id);
                  if (!item) return null;
                  const photoField = imageField(item);
                  const photoUrl = photoField
                    ? rowImageUploads[`${item.id}:${photoField}`]?.preview || item.fields[photoField]
                    : "";
                  const itemIndex = items.findIndex((row) => row.id === item.id);
                  return (
                    <div
                      style={{
                        width: draggedRow.width || undefined,
                        boxSizing: "border-box",
                      }}
                      className="w-[min(1100px,calc(100vw-2rem))] rounded-2xl border-2 border-primaryColor bg-white p-5 shadow-2xl ring-4 ring-primaryColor/10"
                      aria-hidden="true"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="h-4 w-4 text-primaryColor" />
                          <span className="flex h-6 items-center px-2 rounded-md bg-primaryColor/10 font-bold text-xs text-primaryColor">
                            #{itemIndex + 1}
                          </span>
                          <span className="font-semibold text-sm text-gray-900 truncate">
                            {item.fields.name || item.fields.title || item.fields.question || `Entry #${itemIndex + 1}`}
                          </span>
                        </div>
                      </div>
                      <div className={photoField ? "flex gap-4 items-center" : ""}>
                        {photoField && (
                          <div
                            className={`relative h-14 w-14 shrink-0 overflow-hidden border border-gray-200 bg-gray-50 ${
                              isTeam ? "rounded-full" : "rounded-xl p-1"
                            }`}
                          >
                            {photoUrl ? (
                              <Image
                                src={photoUrl}
                                alt=""
                                fill
                                unoptimized
                                sizes="56px"
                                className={isTeam ? "object-cover" : "object-contain"}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-bold text-gray-400">
                                {(item.fields.name || "?").slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.fields.name || item.fields.title || item.fields.question}
                          </p>
                          {item.fields.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {item.fields.description}
                            </p>
                          )}
                          {item.fields.bio && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {item.fields.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </SectionHeading>
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
              const active = slug === page.slug;
              return (
                <button
                  key={page.slug}
                  type="button"
                  onClick={() => {
                    setSlug(page.slug);
                    setActiveSection("who");
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition ${
                    active
                      ? "bg-primaryColor/10 text-primaryColor font-semibold border border-primaryColor/20 shadow-xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primaryColor" : "text-gray-400"}`} />
                  <span>{page.label}</span>
                </button>
              );
            })}
          </nav>

          {slug === "about-us" && (
            <>
              <div className="my-3 border-t border-gray-100" />
              <h2 className="px-0 pb-2 text-xs font-semibold text-gray-500">
                About Us Sections
              </h2>
              <nav aria-label="About Us sections" className="space-y-1">
                {aboutSections.map((section) => {
                  const Icon = section.icon;
                  const count =
                    "key" in section
                      ? getArrayLength(structuredContent[section.key])
                      : null;
                  const active = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition ${
                        active
                          ? "bg-primaryColor/10 text-primaryColor font-semibold border border-primaryColor/20 shadow-xs"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primaryColor" : "text-gray-400"}`} />
                        <span className="truncate">{section.label}</span>
                      </span>
                      {count !== null && (
                        <span
                          className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition ${
                            active
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
              </nav>
            </>
          )}
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
    </form>
  );
}
