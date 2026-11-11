"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import {
  useCreatePostBaccalaureateProgramMutation,
  useEditPostBaccalaureateProgramMutation,
  useGetPostBaccalaureateCategoriesQuery,
} from "@/feature/slice/admin/academia/PostBaccalaureateSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import {
  PostBaccalaureateCategoryType,
  PostBaccalaureateProgramType,
} from "@/lib/type";
import { Check, Loader2, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface PostBaccalaureateModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  editingProgram: PostBaccalaureateProgramType | null;
}

interface FormState {
  program_name: string;
  state_id: string;
  location: string;
  latitude: string;
  longitude: string;
  website: string;
  phone: string;
  category_ids: number[];
}

function getInitialFormState(
  editingProgram: PostBaccalaureateProgramType | null,
): FormState {
  if (!editingProgram) {
    return {
      program_name: "",
      state_id: "",
      location: "",
      latitude: "",
      longitude: "",
      website: "",
      phone: "",
      category_ids: [],
    };
  }

  return {
    program_name: editingProgram.program_name || "",
    state_id: editingProgram.state_id ? String(editingProgram.state_id) : "",
    location: editingProgram.location || "",
    latitude: editingProgram.latitude ?? editingProgram.map_pin?.latitude ?? "",
    longitude:
      editingProgram.longitude ?? editingProgram.map_pin?.longitude ?? "",
    website: editingProgram.website || "",
    phone: editingProgram.phone || "",
    category_ids: (editingProgram.categories || []).map((c) => c.id),
  };
}

function PostBaccalaureateForm({
  editingProgram,
  onClose,
}: {
  editingProgram: PostBaccalaureateProgramType | null;
  onClose: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<FormState>(() =>
    getInitialFormState(editingProgram),
  );

  const { data: stateResponse } = useGetAllStateQuery({});
  const { data: categoriesResponse } = useGetPostBaccalaureateCategoriesQuery();

  const [createProgram, { isLoading: isCreating }] =
    useCreatePostBaccalaureateProgramMutation();
  const [editProgram, { isLoading: isUpdating }] =
    useEditPostBaccalaureateProgramMutation();

  const isSubmitting = isCreating || isUpdating;

  const stateOptions = useMemo(() => {
    const rawStates: Array<{ id: number; name: string }> =
      stateResponse?.data || [];
    return rawStates.map((st) => ({
      value: String(st.id),
      label: st.name,
    }));
  }, [stateResponse]);

  const availableCategories = useMemo(() => {
    const allCats: PostBaccalaureateCategoryType[] =
      categoriesResponse?.data || [];
    const attachedIds = new Set(formData.category_ids);

    return allCats.filter((cat) => cat.is_active || attachedIds.has(cat.id));
  }, [categoriesResponse, formData.category_ids]);

  const toggleCategory = (id: number) => {
    setFormData((prev) => {
      const exists = prev.category_ids.includes(id);
      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter((item) => item !== id)
          : [...prev.category_ids, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.program_name.trim()) {
      toast.error("Please enter the university / program name.");
      return;
    }

    if (!formData.state_id) {
      toast.error("Please select a state.");
      return;
    }

    if (formData.category_ids.length === 0) {
      toast.error("Please select at least one Degree/Recognition category.");
      return;
    }

    const latTrimmed = formData.latitude.trim();
    const lngTrimmed = formData.longitude.trim();
    if ((latTrimmed && !lngTrimmed) || (!latTrimmed && lngTrimmed)) {
      toast.error(
        "Please provide both latitude and longitude, or leave both empty.",
      );
      return;
    }

    if (latTrimmed && lngTrimmed) {
      const latNum = Number(latTrimmed);
      const lngNum = Number(lngTrimmed);
      if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
        toast.error("Latitude must be a valid number between -90 and 90.");
        return;
      }
      if (Number.isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        toast.error("Longitude must be a valid number between -180 and 180.");
        return;
      }
    }

    const payload = {
      program_name: formData.program_name.trim(),
      state_id: Number(formData.state_id),
      location: formData.location.trim() || null,
      latitude: latTrimmed || null,
      longitude: lngTrimmed || null,
      website: formData.website.trim() || null,
      phone: formData.phone.trim() || null,
      category_ids: formData.category_ids,
    };

    try {
      if (editingProgram) {
        await editProgram({ id: editingProgram.id, ...payload }).unwrap();
        toast.success("Post-baccalaureate program updated successfully.");
      } else {
        await createProgram(payload).unwrap();
        toast.success("Post-baccalaureate program created successfully.");
      }
      onClose(false);
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      const firstValidationError = err?.data?.errors
        ? Object.values(err.data.errors).flat()[0]
        : null;
      toast.error(
        firstValidationError ||
          err?.data?.message ||
          "Failed to save post-baccalaureate program.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInput
          label="University / Program Name"
          required
          placeholder="e.g. Johns Hopkins Post-Bacc PreMed"
          value={formData.program_name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              program_name: e.target.value,
            }))
          }
        />

        <CustomSelect
          label="State"
          required
          placeholder="Select state"
          value={formData.state_id}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, state_id: String(val) }))
          }
          options={stateOptions}
        />

        <CustomInput
          label="Location (City, State)"
          placeholder="e.g. Baltimore, MD"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <CustomInput
          label="Website URL"
          placeholder="https://example.edu/postbacc"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
        />

        <CustomInput
          label="Phone (Optional)"
          placeholder="e.g. (410) 516-7748"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>

      <div className="bg-[#D3F4EF] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-base font-semibold text-grayColor1">
          <MapPin className="w-4 h-4 text-primaryColor" />
          <span>Map Coordinates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            label="Latitude"
            placeholder="e.g. 39.3299"
            value={formData.latitude}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, latitude: e.target.value }))
            }
          />
          <CustomInput
            label="Longitude"
            placeholder="e.g. -76.6205"
            value={formData.longitude}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, longitude: e.target.value }))
            }
          />
        </div>
        <p className="text-xs text-descriptionColor">
          Enter coordinates so users clicking this university row can jump directly to its map pin and website popup.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Degree/Recognition Categories{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{formData.category_ids.length} selected</span>
            {formData.category_ids.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, category_ids: [] }))
                }
                className="text-red-600 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 p-3 bg-white">
          {availableCategories.length === 0 ? (
            <p className="text-sm text-gray-500 py-2 text-center">
              No categories available. Create categories in the Filter Categories tab first.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const selected = formData.category_ids.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors cursor-pointer ${
                      selected
                        ? "bg-primaryColor text-white border-primaryColor font-medium"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{category.name}</span>
                    {!category.is_active && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          selected
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Inactive
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-4 py-2 rounded-lg border border-[#B6B6B6] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-primaryColor text-white text-sm font-medium hover:opacity-95 disabled:opacity-60 transition-opacity cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{editingProgram ? "Update Program" : "Save Program"}</span>
        </button>
      </div>
    </form>
  );
}

export default function PostBaccalaureateModal({
  isOpen,
  onClose,
  editingProgram,
}: PostBaccalaureateModalProps) {
  return (
    <CustomModal
      open={isOpen}
      onOpenChange={onClose}
      title={
        editingProgram
          ? "Edit Post-Baccalaureate Program"
          : "Add Post-Baccalaureate Program"
      }
      size="lg"
    >
      {isOpen && (
        <PostBaccalaureateForm
          key={editingProgram ? `edit-${editingProgram.id}` : "create"}
          editingProgram={editingProgram}
          onClose={onClose}
        />
      )}
    </CustomModal>
  );
}
