"use client";

import { useMemo } from "react";
import type {
  GroupBase,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type CreatableSelectFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  values?: string[];
  onChangeValues?: (values: string[]) => void;
  isMulti?: boolean;
  maxCount?: number;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  className?: string;
  allowCustomInput?: boolean;
  isDisabled?: boolean;
};

type FlatOption = { value: string; label: string };

const selectStyles: StylesConfig<FlatOption, boolean, GroupBase<FlatOption>> = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#00A3B1" : base.borderColor,
    boxShadow: state.isFocused ? "0 0 0 2px #D9F4F7" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#00A3B1" : base.borderColor,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingTop: "2px",
    paddingBottom: "2px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: "9999px",
  }),
};

function flattenOptions(options: Array<{ value: string; label: string }> = []) {
  return options.map((option) => ({
    value: String(option.value ?? ""),
    label: String(option.label ?? option.value ?? ""),
  }));
}

function toOption(value: string, options: FlatOption[]) {
  const normalizedValue = String(value ?? "");
  const matched = options.find((option) => option.value === normalizedValue);
  return matched ?? { value: normalizedValue, label: normalizedValue };
}

function CreatableSelectField({
  value,
  onChange,
  values,
  onChangeValues,
  isMulti = false,
  maxCount,
  options,
  placeholder,
  className,
  allowCustomInput = false,
  isDisabled = false,
}: CreatableSelectFieldProps) {
  const flatOptions = useMemo(() => {
    if (!options) return [];
    return flattenOptions(options);
  }, [options]);

  const mergedOptions = useMemo(() => {
    return flatOptions;
  }, [flatOptions]);

  const selectedValue = useMemo(() => {
    if (isMulti) {
      return (values || []).map((item) => toOption(item, flatOptions));
    }

    if (value === undefined || value === null || value === "") {
      return null;
    }

    return toOption(value, flatOptions);
  }, [flatOptions, isMulti, value, values]);

  const handleChange = (
    nextValue: MultiValue<FlatOption> | SingleValue<FlatOption>,
  ) => {
    if (isMulti) {
      const nextArray = Array.isArray(nextValue)
        ? nextValue
            .slice(0, maxCount || nextValue.length)
            .map((item) => item.value)
        : [];
      onChangeValues?.(nextArray);
      return;
    }

    onChange?.((nextValue as FlatOption | null)?.value || "");
  };

  const SelectComponent = allowCustomInput ? CreatableSelect : Select;

  return (
    <SelectComponent
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={isDisabled}
      isClearable
      isSearchable
      isOptionDisabled={() =>
        Boolean(isMulti && maxCount && (values?.length || 0) >= maxCount)
      }
      options={mergedOptions}
      value={selectedValue as any}
      onChange={handleChange}
      className={className}
      classNamePrefix="common-select"
      styles={selectStyles}
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
      noOptionsMessage={() => "No options"}
    />
  );
}

export default CreatableSelectField;
