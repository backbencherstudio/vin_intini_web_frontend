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

type FlatOption = { value: string; label: string };
type GroupedOption = { label: string; options: FlatOption[] };

type CreatableSelectFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  values?: string[];
  onChangeValues?: (values: string[]) => void;
  isMulti?: boolean;
  maxCount?: number;
  options: Array<FlatOption | GroupedOption>;
  placeholder: string;
  className?: string;
  allowCustomInput?: boolean;
  type?: "text" | "number";
  isDisabled?: boolean;
};

function isGroupedOption(option: any): option is GroupedOption {
  return option.options && Array.isArray(option.options) && !option.value;
}

function flattenAllOptions(
  options: Array<FlatOption | GroupedOption> = [],
): FlatOption[] {
  return options.flatMap((option) => {
    if (isGroupedOption(option)) {
      return option.options;
    }
    return option as FlatOption;
  });
}

function toOption(value: string, options: FlatOption[]) {
  const normalizedValue = String(value ?? "");
  const matched = options.find(
    (option) => String(option.value) === normalizedValue,
  );
  return matched ?? { value: normalizedValue, label: normalizedValue };
}

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
  type = "text",
  isDisabled = false,
}: CreatableSelectFieldProps) {
  const flatOptions = useMemo(() => {
    if (!options) return [];
    return flattenAllOptions(options);
  }, [options]);

  const handleInputChange = (inputValue: string) => {
    if (type !== "number") {
      return inputValue;
    }

    return inputValue.replace(/[^0-9]/g, "");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (type !== "number") {
      return;
    }

    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

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
      options={options as any}
      value={selectedValue as any}
      onChange={handleChange}
      onInputChange={(inputValue) => handleInputChange(inputValue)}
      onKeyDown={handleKeyDown}
      className={className}
      classNamePrefix="common-select"
      styles={selectStyles}
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
      noOptionsMessage={() => "No options"}
    />
  );
}

export default CreatableSelectField;
