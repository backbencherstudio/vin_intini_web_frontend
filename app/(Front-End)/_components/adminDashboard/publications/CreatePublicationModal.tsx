"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Upload,
  BookOpen,
  Building2,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import {
  useCreateAdminPublicationMutation,
  useUpdateAdminPublicationMutation,
} from "@/feature/slice/admin/publication";
import { PublicationItem } from "@/feature/slice/admin/publication/publicationType";
import { useGetVerifiedIndustriesQuery } from "@/feature/slice/admin/products";
import { useGetUsersQuery } from "@/feature/slice/admin/user-management/userApi";

export interface CreatePublicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultNetwork?: "all" | "psychology" | "neuroscience";
  editingPublication?: PublicationItem | null;
  onSuccess?: () => void;
}

const NETWORK_OPTIONS: SelectOption[] = [
  { label: "Psychology", value: "psychology" },
  { label: "Neuroscience", value: "neuroscience" },
];

const PUBLICATION_TYPE_OPTIONS: SelectOption[] = [
  { label: "Professional", value: "professional" },
  { label: "University", value: "university" },
  { label: "Freelance", value: "freelance" },
  { label: "Other", value: "other" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Inactive", value: "inactive" },
];

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export default function CreatePublicationModal({
  open,
  onOpenChange,
  defaultNetwork = "psychology",
  editingPublication = null,
  onSuccess,
}: CreatePublicationModalProps) {
  const isEditing = Boolean(editingPublication);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Owner states
  const [ownerType, setOwnerType] = useState<
    "industry" | "premium_user" | "official"
  >("industry");
  const [industryId, setIndustryId] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>("");

  // Form states
  const [title, setTitle] = useState("");
  const [networkType, setNetworkType] = useState<string>("psychology");
  const [publicationType, setPublicationType] = useState<string>("professional");
  const [authors, setAuthors] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [abstract, setAbstract] = useState("");
  const [status, setStatus] = useState<string>("active");

  // Attachment state
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mutations
  const [createPublication, { isLoading: isCreating }] =
    useCreateAdminPublicationMutation();
  const [updatePublication, { isLoading: isUpdating }] =
    useUpdateAdminPublicationMutation();
  const isSubmitting = isCreating || isUpdating;

  // Queries for Owner selection
  const { data: verifiedIndustriesRes, isLoading: isLoadingIndustries } =
    useGetVerifiedIndustriesQuery();
  const { data: usersRes, isLoading: isLoadingUsers } = useGetUsersQuery({
    query: { type: "premium", per_page: 100 },
  });

  const industryOptions = useMemo<SelectOption[]>(() => {
    const list = verifiedIndustriesRes?.data || [];
    return list.map((ind: any) => ({
      label: `${ind.name}${ind.industry ? ` (${ind.industry})` : ""}`,
      value: String(ind.id),
    }));
  }, [verifiedIndustriesRes]);

  const userOptions = useMemo<SelectOption[]>(() => {
    const rawList = usersRes?.data || [];
    const list = Array.isArray(rawList)
      ? rawList
      : (rawList as any)?.users || [];
    return list.map((u: any) => ({
      label: `${
        u.full_name ||
        u.name ||
        `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
        u.username
      } (${u.email || "No email"})`,
      value: String(u.id),
    }));
  }, [usersRes]);

  // Initialize or reset form data
  useEffect(() => {
    if (!open) {
      setErrors({});
      return;
    }

    if (editingPublication) {
      setTitle(editingPublication.title || "");
      setNetworkType(
        editingPublication.network_type === "neuroscience"
          ? "neuroscience"
          : "psychology"
      );
      setPublicationType(editingPublication.publication_type || "professional");
      setAuthors(
        Array.isArray(editingPublication.authors)
          ? editingPublication.authors.join(", ")
          : ""
      );
      setWebsiteUrl(editingPublication.website_url || "");
      setAbstract(editingPublication.abstract || "");
      setStatus(editingPublication.status || "active");
      setExistingAttachmentUrl(editingPublication.attachment_url || "");
      setAttachmentFile(null);

      // Determine owner type for edit mode
      if (editingPublication.industry_id || editingPublication.industry?.id) {
        setOwnerType("industry");
        setIndustryId(
          String(
            editingPublication.industry_id || editingPublication.industry?.id
          )
        );
        setCreatorId("");
      } else if (
        editingPublication.creator_id ||
        editingPublication.creator?.id
      ) {
        const isCreatorAdmin =
          (editingPublication as any).is_admin_publication ||
          editingPublication.creator?.is_admin ||
          editingPublication.creator?.roles?.includes("admin") ||
          editingPublication.creator?.email === "admin@gmail.com" ||
          (editingPublication.creator?.name || "").toLowerCase().includes("admin");

        if (isCreatorAdmin) {
          setOwnerType("official");
          setIndustryId("");
          setCreatorId("");
        } else {
          setOwnerType("premium_user");
          setCreatorId(
            String(
              editingPublication.creator_id || editingPublication.creator?.id
            )
          );
          setIndustryId("");
        }
      } else {
        setOwnerType("official");
        setIndustryId("");
        setCreatorId("");
      }
    } else {
      setTitle("");
      setNetworkType(
        defaultNetwork === "neuroscience" ? "neuroscience" : "psychology"
      );
      setPublicationType("professional");
      setAuthors("");
      setWebsiteUrl("");
      setAbstract("");
      setStatus("active");
      setOwnerType("industry");
      setIndustryId("");
      setCreatorId("");
      setExistingAttachmentUrl("");
      setAttachmentFile(null);
    }
    setErrors({});
  }, [open, editingPublication, defaultNetwork]);

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrors((prev) => ({
        ...prev,
        attachment: "Attachment size must be under 25MB.",
      }));
      return;
    }

    const isValidType =
      ALLOWED_MIME_TYPES.has(file.type) ||
      /\.(pdf|doc|docx)$/i.test(file.name);

    if (!isValidType) {
      setErrors((prev) => ({
        ...prev,
        attachment: "Only PDF, DOC, or DOCX document formats are allowed.",
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.attachment;
      return copy;
    });
    setAttachmentFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (ownerType === "industry" && !industryId) {
      errs.industry_id = "Please select an Industry / Company.";
    }

    if (ownerType === "premium_user" && !creatorId) {
      errs.creator_id = "Please select a Premium User.";
    }

    if (!title.trim()) {
      errs.title = "Publication title is required.";
    }

    if (!networkType) {
      errs.network_type = "Network category is required.";
    }

    if (!publicationType) {
      errs.publication_type = "Publication type is required.";
    }

    if (!websiteUrl.trim()) {
      errs.website_url = "Reference URL is required.";
    } else {
      try {
        new URL(websiteUrl.trim());
      } catch {
        errs.website_url = "Please enter a valid website URL (e.g. https://...).";
      }
    }

    if (!abstract.trim()) {
      errs.abstract = "Abstract or article summary is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    try {
      const formData = new FormData();
      formData.append("owner_type", ownerType);
      if (ownerType === "industry" && industryId) {
        formData.append("industry_id", industryId);
      } else if (ownerType === "premium_user" && creatorId) {
        formData.append("creator_id", creatorId);
      }

      formData.append("title", title.trim());
      formData.append("network_type", networkType);
      formData.append("publication_type", publicationType);
      formData.append("website_url", websiteUrl.trim());
      formData.append("abstract", abstract.trim());
      formData.append("status", status);

      if (authors.trim()) {
        const authorsList = authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
        formData.append("authors", JSON.stringify(authorsList));
      }

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      if (isEditing && editingPublication) {
        await updatePublication({
          id: editingPublication.id,
          body: formData,
        }).unwrap();
        toast.success("Publication updated successfully!");
      } else {
        await createPublication(formData).unwrap();
        toast.success("Publication created successfully!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const apiMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to save publication. Please check the inputs.";
      toast.error(apiMsg);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        {/* Modal Header without duplicate close icon */}
        <div className="flex items-center justify-between border-b pb-3 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#E6F8F6] p-2 text-primaryColor">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isEditing ? "Edit Publication" : "Add New Publication"}
              </h3>
              <p className="text-xs text-gray-500">
                {isEditing
                  ? "Update existing publication details and settings."
                  : "Upload a research paper, article, or publication directly to the platform."}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Publication Owner Selection (Industry Pro vs Premium User vs Official) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Publish On Behalf Of *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                ownerType === "industry"
                  ? "border-primaryColor bg-primaryColor/5 text-primaryColor font-semibold shadow-xs"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="owner_type"
                value="industry"
                checked={ownerType === "industry"}
                onChange={() => {
                  setOwnerType("industry");
                  setCreatorId("");
                }}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="text-xs">Industry Pro</span>
            </label>

            <label
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                ownerType === "premium_user"
                  ? "border-primaryColor bg-primaryColor/5 text-primaryColor font-semibold shadow-xs"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="owner_type"
                value="premium_user"
                checked={ownerType === "premium_user"}
                onChange={() => {
                  setOwnerType("premium_user");
                  setIndustryId("");
                }}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <UserIcon className="w-4 h-4 shrink-0" />
              <span className="text-xs">Premium User</span>
            </label>

            <label
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                ownerType === "official"
                  ? "border-primaryColor bg-primaryColor/5 text-primaryColor font-semibold shadow-xs"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="owner_type"
                value="official"
                checked={ownerType === "official"}
                onChange={() => {
                  setOwnerType("official");
                  setIndustryId("");
                  setCreatorId("");
                }}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-xs">MindUnite Official</span>
            </label>
          </div>

          {/* Conditional Select for Industry Pro */}
          {ownerType === "industry" && (
            <div className="pt-1.5">
              <CustomSelect
                label="Select Company / Industry *"
                options={industryOptions}
                value={industryId}
                onChange={(val) => setIndustryId(String(val))}
                placeholder={
                  isLoadingIndustries
                    ? "Loading verified companies..."
                    : "Choose a Company / Industry"
                }
              />
              {errors.industry_id && (
                <p className="mt-1 text-xs text-red-500">{errors.industry_id}</p>
              )}
            </div>
          )}

          {/* Conditional Select for Premium User */}
          {ownerType === "premium_user" && (
            <div className="pt-1.5">
              <CustomSelect
                label="Select Premium User / Researcher *"
                options={userOptions}
                value={creatorId}
                onChange={(val) => setCreatorId(String(val))}
                placeholder={
                  isLoadingUsers
                    ? "Loading registered users..."
                    : "Choose a Premium User"
                }
              />
              {errors.creator_id && (
                <p className="mt-1 text-xs text-red-500">{errors.creator_id}</p>
              )}
            </div>
          )}
        </div>

        {/* 2. Title */}
        <div>
          <CustomInput
            label="Publication Title *"
            type="text"
            placeholder="e.g. Breakthroughs in Neural Circuit Dynamics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* 3. Network & Publication Type row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <CustomSelect
              label="Network Category *"
              options={NETWORK_OPTIONS}
              value={networkType}
              onChange={(val) => setNetworkType(String(val))}
              placeholder="Select Network"
            />
            {errors.network_type && (
              <p className="mt-1 text-xs text-red-500">{errors.network_type}</p>
            )}
          </div>

          <div>
            <CustomSelect
              label="Publication Type *"
              options={PUBLICATION_TYPE_OPTIONS}
              value={publicationType}
              onChange={(val) => setPublicationType(String(val))}
              placeholder="Select Type"
            />
            {errors.publication_type && (
              <p className="mt-1 text-xs text-red-500">
                {errors.publication_type}
              </p>
            )}
          </div>
        </div>

        {/* 4. Authors & Reference URL row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <CustomInput
              label="Authors (Comma Separated)"
              type="text"
              placeholder="e.g. Dr. Jane Smith, Prof. Alan Turing"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
            />
          </div>

          <div>
            <CustomInput
              label="Reference / DOI URL *"
              type="url"
              placeholder="https://doi.org/... or https://..."
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            {errors.website_url && (
              <p className="mt-1 text-xs text-red-500">{errors.website_url}</p>
            )}
          </div>
        </div>

        {/* 5. Abstract / Summary */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Abstract / Summary *
          </label>
          <textarea
            rows={4}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Write a clear and comprehensive summary of the research article or findings..."
            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-primaryColor focus:outline-hidden focus:ring-1 focus:ring-primaryColor"
          />
          {errors.abstract && (
            <p className="mt-1 text-xs text-red-500">{errors.abstract}</p>
          )}
        </div>

        {/* 6. Document Attachment Upload */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            PDF / Document Attachment
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-primaryColor bg-primaryColor/5"
                : "border-gray-200 hover:border-primaryColor/50 hover:bg-gray-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-xs font-semibold text-primaryColor">
              Click to upload <span className="text-gray-500 font-normal">or drag and drop</span>
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              PDF, DOC, or DOCX (Max 25MB)
            </p>

            {(attachmentFile || existingAttachmentUrl) && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
                <FileText className="h-4 w-4 text-primaryColor" />
                <span className="font-medium truncate max-w-xs">
                  {attachmentFile
                    ? attachmentFile.name
                    : existingAttachmentUrl.split("/").pop()}
                </span>
              </div>
            )}
          </div>
          {errors.attachment && (
            <p className="mt-1 text-xs text-red-500">{errors.attachment}</p>
          )}
        </div>

        {/* 7. Status */}
        <div className="pt-1 border-t border-gray-100">
          <CustomSelect
            label="Publication Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(val) => setStatus(String(val))}
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-10 px-4 text-xs font-semibold"
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className="h-10 bg-[#04A1B7] px-6 text-xs font-semibold text-white shadow-xs hover:bg-[#038b9e]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Publish Article"
            )}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
}
