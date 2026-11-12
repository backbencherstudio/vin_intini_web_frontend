"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Building2, ShieldCheck, Upload } from "lucide-react";
import toast from "react-hot-toast";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import {
  useCreateAdminProductMutation,
  useGetVerifiedIndustriesQuery,
  useUpdateAdminProductMutation,
  type AdminIndustryType,
  type AdminNetworkType,
  type AdminProductItem,
  type AdminProductSection,
  type AdminProductStatus,
} from "@/feature/slice/admin/products";
import { extractApiErrorMessage, stripHtmlToText } from "./productHelpers";

export interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
  sections: AdminProductSection[];
  editingProduct?: AdminProductItem | null;
  defaultSectionId?: number;
  defaultCategoryId?: number;
  onSuccess?: () => void;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Draft", value: "draft" },
];

type FormErrors = Partial<
  Record<
    | "industry_id"
    | "section_id"
    | "category_id"
    | "product_name"
    | "product_url"
    | "description"
    | "image"
    | "poc_email",
    string
  >
>;

interface ProductModalFormProps {
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
  sections: AdminProductSection[];
  editingProduct?: AdminProductItem | null;
  defaultSectionId?: number;
  defaultCategoryId?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

function ProductModalForm({
  networkType,
  industryType,
  sections,
  editingProduct,
  defaultSectionId,
  defaultCategoryId,
  onClose,
  onSuccess,
}: ProductModalFormProps) {
  const isEditing = Boolean(editingProduct);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialSectionId = (() => {
    if (editingProduct?.section_id) return String(editingProduct.section_id);
    if (
      defaultSectionId &&
      sections.some((sec) => sec.id === defaultSectionId)
    ) {
      return String(defaultSectionId);
    }
    return sections[0] ? String(sections[0].id) : "";
  })();

  const initialCategoryId = (() => {
    if (editingProduct?.category_id) return String(editingProduct.category_id);
    const chosenSection = sections.find(
      (sec) => String(sec.id) === initialSectionId,
    );
    if (
      defaultCategoryId &&
      chosenSection?.categories.some((cat) => cat.id === defaultCategoryId)
    ) {
      return String(defaultCategoryId);
    }
    return chosenSection?.categories[0]
      ? String(chosenSection.categories[0].id)
      : "";
  })();

  const [industryId, setIndustryId] = useState<string>(
    editingProduct?.industry_id ? String(editingProduct.industry_id) : "",
  );
  const [sectionId, setSectionId] = useState<string>(initialSectionId);
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId);
  const [productName, setProductName] = useState<string>(
    editingProduct?.product_name ?? "",
  );
  const [productUrl, setProductUrl] = useState<string>(
    editingProduct?.product_url ?? "",
  );
  const [status, setStatus] = useState<AdminProductStatus>(
    editingProduct?.status ?? "active",
  );
  const [tagsInput, setTagsInput] = useState<string>(
    Array.isArray(editingProduct?.tags) ? editingProduct.tags.join(", ") : "",
  );
  const [description, setDescription] = useState<string>(
    editingProduct?.description ?? "",
  );
  const [pocName, setPocName] = useState<string>(
    editingProduct?.poc_name ?? "",
  );
  const [pocEmail, setPocEmail] = useState<string>(
    editingProduct?.poc_email ?? "",
  );
  const [pocPhone, setPocPhone] = useState<string>(
    editingProduct?.poc_phone ?? "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  const {
    data: verifiedIndustriesRes,
    isLoading: isLoadingIndustries,
    isError: isIndustriesError,
  } = useGetVerifiedIndustriesQuery();

  const [createAdminProduct, { isLoading: isCreating }] =
    useCreateAdminProductMutation();
  const [updateAdminProduct, { isLoading: isUpdating }] =
    useUpdateAdminProductMutation();

  const isSubmitting = isCreating || isUpdating;

  const verifiedIndustries = useMemo(
    () => verifiedIndustriesRes?.data ?? [],
    [verifiedIndustriesRes?.data],
  );

  // Sort industries matching the active sub-tab first so selection is ergonomic.
  const sortedVerifiedIndustries = useMemo(() => {
    return [...verifiedIndustries].sort((a, b) => {
      const aMatch = (a.industry || "").toLowerCase() === industryType ? 0 : 1;
      const bMatch = (b.industry || "").toLowerCase() === industryType ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return a.name.localeCompare(b.name);
    });
  }, [industryType, verifiedIndustries]);

  const industryOptions: SelectOption[] = useMemo(
    () =>
      sortedVerifiedIndustries.map((item) => {
        const typeSuffix = item.industry ? ` (${item.industry})` : "";
        const ownerSuffix = item.owner?.email ? ` — ${item.owner.email}` : "";
        return {
          value: String(item.id),
          label: `${item.name}${typeSuffix}${ownerSuffix}`,
        };
      }),
    [sortedVerifiedIndustries],
  );

  const selectedIndustry = useMemo(
    () =>
      verifiedIndustries.find((item) => String(item.id) === industryId) ?? null,
    [industryId, verifiedIndustries],
  );

  const isExistingProductIndustryUnverified =
    isEditing &&
    Boolean(editingProduct?.industry_id) &&
    !isLoadingIndustries &&
    !verifiedIndustries.some(
      (item) => item.id === editingProduct?.industry_id,
    ) &&
    industryId === String(editingProduct?.industry_id);

  const sectionOptions: SelectOption[] = useMemo(
    () =>
      sections.map((sec) => ({
        value: String(sec.id),
        label: sec.name,
      })),
    [sections],
  );

  const selectedSection = useMemo(
    () => sections.find((sec) => String(sec.id) === sectionId) ?? null,
    [sectionId, sections],
  );

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      (selectedSection?.categories ?? []).map((cat) => ({
        value: String(cat.id),
        label: cat.category_name,
      })),
    [selectedSection],
  );

  const handleSectionChange = (value: string | number) => {
    const nextSectionId = String(value);
    setSectionId(nextSectionId);

    const nextSection = sections.find(
      (sec) => String(sec.id) === nextSectionId,
    );
    const firstCat = nextSection?.categories[0];
    setCategoryId(firstCat ? String(firstCat.id) : "");
    setErrors((prev) => ({
      ...prev,
      section_id: undefined,
      category_id: undefined,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a JPEG, JPG, PNG, or WEBP image.",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        image: "Image file size must be 5 MB or less.",
      }));
      return;
    }

    if (objectPreviewUrl) {
      URL.revokeObjectURL(objectPreviewUrl);
    }

    setImageFile(file);
    setObjectPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!industryId) {
      nextErrors.industry_id = "Please select a verified and active industry.";
    } else if (
      !verifiedIndustries.some((item) => String(item.id) === industryId)
    ) {
      nextErrors.industry_id =
        "Selected industry is not verified or active. Choose a verified industry.";
    }

    if (!sectionId) {
      nextErrors.section_id = "Please select a section.";
    }

    if (!categoryId) {
      nextErrors.category_id = "Please select a category.";
    }

    if (!productName.trim()) {
      nextErrors.product_name = "Product name is required.";
    }

    const plainDesc = stripHtmlToText(description);
    if (!plainDesc) {
      nextErrors.description = "Product description is required.";
    } else if (description.length > 5000) {
      nextErrors.description =
        "Description exceeds the 5,000-character HTML limit.";
    }

    if (productUrl.trim()) {
      try {
        const parsed = new URL(productUrl.trim());
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          nextErrors.product_url = "URL must start with http:// or https://.";
        }
      } catch {
        nextErrors.product_url = "Please enter a valid URL (https://...).";
      }
    }

    if (pocEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pocEmail.trim())) {
      nextErrors.poc_email = "Please enter a valid contact email.";
    }

    if (!isEditing && !imageFile) {
      nextErrors.image = "Product image is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("industry_id", industryId);
    formData.append("product_name", productName.trim());
    formData.append("network_type", networkType);
    formData.append("industry_type", industryType);
    formData.append("section_id", sectionId);
    formData.append("category_id", categoryId);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("information_confirmed", "1");

    if (productUrl.trim() || isEditing) {
      formData.append("product_url", productUrl.trim());
    }

    if (tagsInput.trim()) {
      formData.append("tags", tagsInput.trim());
    }

    if (pocName.trim()) formData.append("poc_name", pocName.trim());
    if (pocEmail.trim()) formData.append("poc_email", pocEmail.trim());
    if (pocPhone.trim()) formData.append("poc_phone", pocPhone.trim());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEditing && editingProduct) {
        const res = await updateAdminProduct({
          id: editingProduct.id,
          body: formData,
        }).unwrap();
        toast.success(res.message || "Product updated successfully.");
      } else {
        const res = await createAdminProduct(formData).unwrap();
        toast.success(
          res.message || "Product uploaded under verified industry.",
        );
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      const serverErrors = (
        error as { data?: { errors?: Record<string, string[] | string> } }
      )?.data?.errors;

      if (serverErrors) {
        const mapped: FormErrors = {};
        (Object.keys(serverErrors) as Array<keyof FormErrors>).forEach(
          (key) => {
            const val = serverErrors[key];
            mapped[key] = Array.isArray(val) ? val[0] : val;
          },
        );
        setErrors((prev) => ({ ...prev, ...mapped }));
      }

      toast.error(
        extractApiErrorMessage(
          error,
          isEditing ? "Failed to update product." : "Failed to create product.",
        ),
      );
    }
  };

  const previewUrl = objectPreviewUrl || editingProduct?.image_url || null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-3">
      {/* Verified Industry Verification Notice + Company Picker */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
        <div className="mb-2.5 flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold text-emerald-950">
              Verified Industry Assignment
            </p>
            <p className="text-xs text-emerald-800">
              Products can only be uploaded under an active, authorization-confirmed, verified company account.
            </p>
          </div>
        </div>

        <CustomSelect
          label="Verified Industry / Company"
          required
          options={industryOptions}
          value={industryId}
          onChange={(val) => {
            setIndustryId(String(val));
            setErrors((prev) => ({ ...prev, industry_id: undefined }));
          }}
          placeholder={
            isLoadingIndustries
              ? "Loading verified industries..."
              : industryOptions.length === 0
                ? "No verified industries found"
                : "Select a verified company"
          }
          disabled={isLoadingIndustries || industryOptions.length === 0}
          error={errors.industry_id}
        />

        {selectedIndustry && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-emerald-900">
            <Building2 className="h-3.5 w-3.5 text-emerald-700" />
            <span className="font-medium">{selectedIndustry.name}</span>
            {selectedIndustry.owner && (
              <span className="text-emerald-700">
                • Verified Owner: {selectedIndustry.owner.full_name} (
                {selectedIndustry.owner.email})
              </span>
            )}
          </div>
        )}

        {isExistingProductIndustryUnverified && (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              This product&apos;s previous company ({editingProduct?.industry?.name ?? `#${editingProduct?.industry_id}`}) is currently unverified or inactive. Choose a verified industry above before saving.
            </span>
          </div>
        )}

        {!isLoadingIndustries &&
          !isIndustriesError &&
          verifiedIndustries.length === 0 && (
            <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>
                No verified and active industry accounts exist yet. Verify an industry partner before adding products.
              </span>
            </div>
          )}
      </div>

      {/* Placement: Section & Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CustomSelect
          label="Section"
          required
          options={sectionOptions}
          value={sectionId}
          onChange={handleSectionChange}
          placeholder="Select section"
          disabled={sectionOptions.length === 0}
          error={errors.section_id}
        />

        <CustomSelect
          label="Category"
          required
          options={categoryOptions}
          value={categoryId}
          onChange={(val) => {
            setCategoryId(String(val));
            setErrors((prev) => ({ ...prev, category_id: undefined }));
          }}
          placeholder={
            categoryOptions.length === 0
              ? "No categories in this section"
              : "Select category"
          }
          disabled={!sectionId || categoryOptions.length === 0}
          error={errors.category_id}
        />
      </div>

      {/* Core Metadata */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CustomInput
          label="Product Name"
          required
          placeholder="e.g., SIGNA One MRI Workflow Platform"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            setErrors((prev) => ({ ...prev, product_name: undefined }));
          }}
          error={errors.product_name}
        />

        <CustomSelect
          label="Visibility Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(val) => setStatus(val as AdminProductStatus)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CustomInput
          label="Product URL"
          type="url"
          placeholder="https://example.com/product"
          value={productUrl}
          onChange={(e) => {
            setProductUrl(e.target.value);
            setErrors((prev) => ({ ...prev, product_url: undefined }));
          }}
          error={errors.product_url}
        />

        <CustomInput
          label="Tags (comma-separated)"
          placeholder="e.g., MRI, Neuroimaging, Clinical"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {/* Rich Text Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#4A4C56]">
          Product Description <span className="ml-0.5">*</span>
        </label>
        <div
          className={`overflow-hidden rounded-lg border ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        >
          <JoditEditor
            value={description}
            height={180}
            placeholder="Write a clear clinical or scientific overview of the product..."
            onChange={(val) => {
              setDescription(val);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
          />
        </div>
        {errors.description && (
          <p role="alert" className="mt-1.5 text-xs text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      {/* Product Image Upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#4A4C56]">
          Product Image {!isEditing && <span className="ml-0.5">*</span>}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Product preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Preview
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CustomButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>{previewUrl ? "Change Image" : "Upload Image"}</span>
              </CustomButton>

              {imageFile && (
                <span className="truncate text-xs font-medium text-gray-600">
                  {imageFile.name} (
                  {(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              JPEG, JPG, PNG, or WEBP up to 5 MB.
              {isEditing && " Leave unchanged to keep the current image."}
            </p>
          </div>
        </div>

        {errors.image && (
          <p role="alert" className="mt-1.5 text-xs text-red-500">
            {errors.image}
          </p>
        )}
      </div>

      {/* Optional Point of Contact */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4">
        <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Point of Contact (Optional)
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CustomInput
            label="Contact Name"
            placeholder="Dr. Jane Doe"
            value={pocName}
            onChange={(e) => setPocName(e.target.value)}
          />
          <CustomInput
            label="Contact Email"
            type="email"
            placeholder="contact@company.com"
            value={pocEmail}
            onChange={(e) => {
              setPocEmail(e.target.value);
              setErrors((prev) => ({ ...prev, poc_email: undefined }));
            }}
            error={errors.poc_email}
          />
          <CustomInput
            label="Contact Phone"
            placeholder="+1 (555) 123-4567"
            value={pocPhone}
            onChange={(e) => setPocPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Modal Footer Buttons */}
      <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </CustomButton>

        <CustomButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          loadingText={isEditing ? "Saving..." : "Uploading..."}
          disabled={isLoadingIndustries || verifiedIndustries.length === 0}
        >
          {isEditing ? "Save Changes" : "Upload Product"}
        </CustomButton>
      </div>
    </form>
  );
}

export default function CreateProductModal({
  open,
  onOpenChange,
  networkType,
  industryType,
  sections,
  editingProduct = null,
  defaultSectionId,
  defaultCategoryId,
  onSuccess,
}: CreateProductModalProps) {
  const formKey = `${editingProduct?.id ?? "new"}-${networkType}-${industryType}-${defaultSectionId ?? "none"}-${defaultCategoryId ?? "none"}`;

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        editingProduct
          ? `Edit ${editingProduct.product_name}`
          : `Add New ${networkType === "psychology" ? "Psychology" : "Neuroscience"} ${industryType === "biotechnology" ? "Biotechnology" : "Psychotropics"} Product`
      }
    >
      {open && (
        <ProductModalForm
          key={formKey}
          networkType={networkType}
          industryType={industryType}
          sections={sections}
          editingProduct={editingProduct}
          defaultSectionId={defaultSectionId}
          defaultCategoryId={defaultCategoryId}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      )}
    </CustomModal>
  );
}
