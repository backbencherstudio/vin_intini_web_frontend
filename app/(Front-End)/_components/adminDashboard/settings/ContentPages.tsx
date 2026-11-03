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
  FileText,
  GripVertical,
  Landmark,
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
  leading_institutions: ["name", "description", "website", "logo"],
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
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-headerColor">
          {number}. {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SortableCard({
  id,
  index,
  children,
  isDropTarget,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  id: string;
  index: number;
  children: ReactNode;
  isDropTarget: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
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
        zIndex: isDragging ? 1 : undefined,
      }}
      className={`grid gap-4 rounded-lg border bg-gray-50/70 p-4 shadow-sm md:grid-cols-[64px_100px_minmax(0,1fr)_40px] md:items-center ${
        isDragging
          ? "border-primaryColor opacity-35"
          : isDropTarget
            ? "border-primaryColor bg-sky-50 shadow-md"
            : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 text-gray-500 md:flex-col md:justify-center md:border-r md:border-gray-200 md:py-2 md:pr-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder entry ${index + 1}`}
          title="Drag to reorder"
          className="cursor-grab touch-none select-none text-xl leading-none active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">#{index + 1}</span>
        <div className="flex md:flex-col">
          <button type="button" onClick={onMoveUp} disabled={isFirst} aria-label={`Move ${index + 1} up`} className="rounded p-1 hover:bg-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onMoveDown} disabled={isLast} aria-label={`Move ${index + 1} down`} className="rounded p-1 hover:bg-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
        </div>
      </div>
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
      leading_institutions: toEditableRows(
        currentData.data.leading_institutions,
        defaultRowFields.leading_institutions,
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

  const handleFounderPhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
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
        );
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
              : field;
        return [{ fieldName: `${section}[${index}][${apiField}]`, file }];
      });

      await updatePage({
        slug,
        body: body as { title: string; content: string },
        ...(slug === "about-us" && founderPhoto ? { founderPhoto } : {}),
        ...(uploads.length ? { uploads } : {}),
      }).unwrap();
      toast.success("Page content saved");
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
        /(photo|image|avatar|logo|thumbnail)/i.test(field),
      );

    return (
      <SectionHeading number={number} title={label} description={description}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {items.length} {label.toLowerCase()} {items.length === 1 ? "entry" : "entries"}
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
              className="inline-flex items-center gap-2 rounded-full border border-primaryColor px-4 py-2 text-sm font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add {key === "team" ? "Member" : key === "faqs" ? "Question" : "Entry"}
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">No entries yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add an entry to start building this section.
              </p>
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
              <div className="space-y-3">
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

                return (
                  <SortableCard
                    key={item.id}
                    id={item.id}
                    index={index}
                    isDropTarget={dragOverRow?.key === key && dragOverRow.id === item.id}
                    onMoveUp={() => moveRow(key, index, index - 1)}
                    onMoveDown={() => moveRow(key, index, index + 1)}
                    isFirst={index === 0}
                    isLast={index === items.length - 1}
                  >
                    {photoField ? (
                      <div className="flex items-center gap-3 md:flex-col">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                          {photoUrl ? (
                            <Image
                              src={photoUrl}
                              alt={`${item.fields.name || label} image`}
                              fill
                              unoptimized
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl text-gray-500">
                              {(item.fields.name || "?").slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <label htmlFor={`row-image-${item.id}`} className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primaryColor hover:underline"><Upload className="h-3 w-3" />Upload image</label>
                        <CustomInput
                          id={`row-image-${item.id}`}
                          type="file"
                          accept="image/*"
                          containerClassName="hidden"
                          onChange={(event) => handleRowImageChange(event, item.id, photoField!)}
                        />
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}

                    <div className="grid min-w-0 gap-2 md:grid-cols-2">
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
                            onChange={(event) =>
                              updateField(index, field, event.target.value)
                            }
                            containerClassName={fields.length === 1 ? "md:col-span-2" : ""}
                          />
                        );
                      })}
                      {key === "videos" && (
                        <div className="grid gap-2 md:col-span-2 md:grid-cols-2">
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
                              onChange={(event) => updateField(index, "url", event.target.value)}
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
                                  {rowVideoUploads[`${item.id}:file`]?.name || "No file selected"}
                                </span>
                              </div>
                              <CustomInput
                                id={`video-file-${item.id}`}
                                type="file"
                                accept=".mp4,.mov,.avi,.wmv,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                                onChange={(event) => handleVideoFileChange(event, item.id)}
                                containerClassName="sr-only"
                                className="sr-only"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const rowUploads = Object.entries(rowImageUploads).filter(([uploadKey]) => uploadKey.startsWith(`${item.id}:`));
                        rowUploads.forEach(([, upload]) => URL.revokeObjectURL(upload.preview));
                        setRowImageUploads((current) => {
                          const next = { ...current };
                          rowUploads.forEach(([uploadKey]) => delete next[uploadKey]);
                          return next;
                        });
                        setRowVideoUploads((current) => {
                          const next = { ...current };
                          delete next[`${item.id}:file`];
                          return next;
                        });
                        setStructuredContent((current) => ({
                          ...current,
                          [key]: current[key].filter(
                            (_entry, itemIndex) => itemIndex !== index,
                          ),
                        }));
                      }}
                      aria-label={`Remove ${label.toLowerCase()} entry ${index + 1}`}
                      className="inline-flex h-9 w-9 items-center justify-center justify-self-end rounded-md bg-red-500 text-white transition hover:bg-red-600 md:justify-self-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </SortableCard>
                );
              })}
              <div
                className={`h-4 rounded border-t-2 transition-colors ${
                  dragOverRow?.key === key && dragOverRow.id === "__end__"
                    ? "border-primaryColor"
                    : "border-transparent"
                }`}
                aria-hidden="true"
              />
              <p className="sr-only" aria-live="polite">
                {draggedRow?.key === key
                  ? `Moving entry ${items.findIndex((row) => row.id === draggedRow.id) + 1}. Drop above a card or at the end of the list.`
                  : ""}
              </p>
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
                  const fields = Object.entries(item.fields).filter(
                    ([field]) => field !== photoField,
                  );
                  const itemIndex = items.findIndex((row) => row.id === item.id);
                  return (
                    <div
                      style={{
                        width: draggedRow.width || undefined,
                        height: draggedRow.height || undefined,
                        boxSizing: "border-box",
                      }}
                      className="grid w-[min(1100px,calc(100vw-2rem))] gap-4 rounded-lg border border-primaryColor bg-white p-4 shadow-2xl md:grid-cols-[64px_100px_minmax(0,1fr)_40px] md:items-center"
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-2 text-gray-500 md:flex-col md:justify-center md:border-r md:border-gray-200 md:py-2 md:pr-3">
                        <GripVertical className="h-5 w-5 text-primaryColor" />
                        <span className="text-sm font-semibold">#{itemIndex + 1}</span>
                      </div>
                      {photoField ? (
                        <div className="flex items-center gap-3 md:flex-col">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                            {photoUrl ? (
                              <Image src={photoUrl} alt="" fill unoptimized sizes="64px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl text-gray-500">
                                {(item.fields.name || "?").slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-primaryColor">Upload image</span>
                        </div>
                      ) : <div className="hidden md:block" />}
                      <div className="grid min-w-0 gap-2 md:grid-cols-2">
                        {fields.map(([field, value]) => {
                          const fieldLabel = field
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (letter) => letter.toUpperCase());
                          const longText = /(bio|description|answer|content)/i.test(field);
                          return (
                            <div key={field} className={longText ? "md:col-span-2" : ""}>
                              <span className="mb-1 block text-sm text-gray-600">{fieldLabel}</span>
                              <div className={`overflow-hidden rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 ${longText ? "min-h-24" : "min-h-10"}`}>
                                {value || <span className="text-gray-400">{fieldLabel}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center justify-self-end rounded-md bg-red-500 text-white md:justify-self-center">
                        <Trash2 className="h-4 w-4" />
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
    <form onSubmit={save} className="space-y-6 pb-6">
      <header className="admin-page-header flex flex-wrap items-center justify-between gap-4 border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <h1 className="admin-page-title text-xl font-semibold text-primaryColor sm:text-2xl">
            Edit {currentPage.label} Page
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Slug: {slug} <span aria-hidden="true">|</span> Update the content
            shown on the public page.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving || isLoading || isError}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primaryColor px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryColor/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </header>

      <div className="grid min-h-[620px] gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <h2 className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? "border border-primaryColor bg-[#D3F4EF] font-semibold text-headerColor shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {page.label}
                </button>
              );
            })}
          </nav>

          {slug === "about-us" && (
            <>
              <div className="my-3 border-t border-gray-100" />
              <h2 className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
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
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                        active
                          ? "border border-primaryColor bg-[#D3F4EF] font-semibold text-headerColor shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{section.label}</span>
                      </span>
                      {count !== null && (
                        <span
                          className={`text-xs ${active ? "text-primaryColor" : "text-gray-400"}`}
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

        <main className="min-w-0">
          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Loading page content…
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm">
              Page content could not be loaded.
            </div>
          ) : slug !== "about-us" ? (
            <SectionHeading
              number="1"
              title={`${currentPage.label} Content`}
              description="Update the page heading and the content shown to visitors."
            >
              <div className="space-y-5">
                <CustomInput
                  label="Page title"
                  required
                  maxLength={255}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Page content
                  </label>
                  <JoditEditor
                    value={content}
                    onChange={setContent}
                    placeholder={`Write the ${currentPage.label.toLowerCase()} content...`}
                    height={520}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Use the toolbar to format headings, paragraphs, lists, links, and images.
                  </p>
                </div>
              </div>
            </SectionHeading>
          ) : activeSection === "who" ? (
            <div className="space-y-4">
              <SectionHeading
                number="1"
                title="Founder Profile"
                description="Manage the founder information shown on the About Us page."
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,2fr)]">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-5 text-center">
                    <div className="relative mb-3 h-40 w-full max-w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <Image
                        src={
                          founderPhotoPreview ||
                          currentFounderPhoto ||
                          "/empty_user.jpg"
                        }
                        alt="Founder portrait preview"
                        fill
                        unoptimized
                        sizes="176px"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Founder photo</p>
                    <p className="mt-1 text-xs text-gray-500">JPG or PNG, up to 5 MB</p>
                    <CustomInput
                      id="founder-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFounderPhotoChange}
                      containerClassName="hidden"
                    />
                    <label
                      htmlFor="founder-photo-upload"
                      className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primaryColor px-4 py-2 text-sm font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white"
                    >
                      <Upload className="h-4 w-4" />
                      Change photo
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <CustomInput
                      label="Founder name"
                      value={founder.name}
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
                      onChange={(event) =>
                        setFounder((current) => ({
                          ...current,
                          designation: event.target.value,
                        }))
                      }
                    />
                    <CustomTextArea
                      label="Biography / intro text"
                      rows={5}
                      value={founder.bio}
                      onChange={(event) =>
                        setFounder((current) => ({
                          ...current,
                          bio: event.target.value,
                        }))
                      }
                      containerClassName="md:col-span-2"
                    />
                    <div className="grid items-end gap-3 md:col-span-2 md:grid-cols-[minmax(0,1fr)_180px]">
                      <CustomInput
                        label="Signature text"
                        value={founder.signature}
                        onChange={(event) =>
                          setFounder((current) => ({
                            ...current,
                            signature: event.target.value,
                          }))
                        }
                      />
                      <div
                        aria-label={`Signature preview: ${founder.signature || "empty"}`}
                        className="flex h-11 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white px-3 shadow-sm"
                      >
                        <span className="font-great-vibes whitespace-nowrap text-3xl text-[#777980]">
                          {founder.signature || "Signature"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </SectionHeading>

              <SectionHeading
                number="2"
                title="Core Values"
                description="Manage the vision, mission, and strategy shown on the About Us page."
              >
                <div className="grid gap-4 xl:grid-cols-3">
                  {(["vision", "mission", "strategy"] as const).map((key) => (
                    <CustomTextArea
                      key={key}
                      label={`Our ${key}`}
                      rows={7}
                      value={coreValues[key]}
                      onChange={(event) =>
                        setCoreValues((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      containerClassName="capitalize"
                    />
                  ))}
                </div>
              </SectionHeading>
            </div>
          ) : activeSection === "team" ? (
            renderStructuredEditor(
              "team",
              "Meet The Team",
              "Manage the team member entries displayed on the About Us page.",
              "3",
            )
          ) : activeSection === "features" ? (
            renderStructuredEditor(
              "videos",
              "Key Features & Videos",
              "Manage the feature videos and their display information.",
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
              "Manage the institution entries shown on the About Us page.",
              "6",
            )
          )}
        </main>
      </div>
    </form>
  );
}
