"use client";

import type { SelectProps } from "antd";
import { Select } from "antd";
import { useMemo, useRef, useState } from "react";

type CreatableSelectFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  values?: string[];
  onChangeValues?: (values: string[]) => void;
  isMulti?: boolean;
  maxCount?: number;
  options: SelectProps["options"];
  placeholder: string;
  className?: string;
  allowCustomInput?: boolean;
};

type FlatOption = { value: string; label: string };

function flattenOptions(option: any): FlatOption[] {
  if (!option) return [];

  if (Array.isArray(option.options)) {
    return option.options.flatMap((nestedOption: any) =>
      flattenOptions(nestedOption),
    );
  }

  return [
    {
      value: String(option.value ?? ""),
      label: String(option.label ?? option.value ?? ""),
    },
  ];
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
}: CreatableSelectFieldProps) {
  const [searchText, setSearchText] = useState("");
  const selectedFromMenuRef = useRef(false);

  const flatOptions = useMemo(() => {
    if (!options) return [];
    return options.flatMap((option: any) => flattenOptions(option));
  }, [options]);

  const mergedOptions = useMemo(() => {
    if (!allowCustomInput) return options;

    const typedValue = searchText.trim();
    if (!typedValue) return options;

    const typedLower = typedValue.toLowerCase();
    const exists = flatOptions.some((option) => {
      return (
        option.label.toLowerCase() === typedLower ||
        option.value.toLowerCase() === typedLower
      );
    });

    if (exists) return options;

    return [...(options || []), { value: typedValue, label: typedValue }];
  }, [allowCustomInput, searchText, flatOptions, options]);

  const commitTypedValue = () => {
    if (isMulti) return;
    if (!allowCustomInput) return;
    if (!onChange) return;

    const typedValue = searchText.trim();
    if (!typedValue) return;

    const typedLower = typedValue.toLowerCase();
    const matched = flatOptions.find((option) => {
      return (
        option.label.toLowerCase() === typedLower ||
        option.value.toLowerCase() === typedLower
      );
    });

    onChange(matched ? matched.value : typedValue);
    setSearchText("");
  };

  return (
    <Select
      mode={isMulti ? (allowCustomInput ? "tags" : "multiple") : undefined}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      value={isMulti ? values || [] : value || undefined}
      options={mergedOptions}
      size="large"
      maxCount={isMulti ? maxCount : undefined}
      className={className}
      filterOption={(input, option) => {
        const label = String(option?.label ?? "").toLowerCase();
        const optionValue = String(option?.value ?? "").toLowerCase();
        const query = input.toLowerCase();

        return label.includes(query) || optionValue.includes(query);
      }}
      onSearch={setSearchText}
      onSelect={() => {
        selectedFromMenuRef.current = true;
      }}
      onChange={(nextValue) => {
        if (isMulti) {
          const nextArray = Array.isArray(nextValue)
            ? nextValue.map((item) => String(item))
            : [];
          onChangeValues?.(nextArray);
        } else {
          onChange?.(String(nextValue));
        }
        setSearchText("");
      }}
      onBlur={() => {
        if (isMulti) return;
        // Delay blur commit so click selection in dropdown wins first.
        setTimeout(() => {
          if (selectedFromMenuRef.current) {
            selectedFromMenuRef.current = false;
            return;
          }
          commitTypedValue();
        }, 0);
      }}
      getPopupContainer={(triggerNode) =>
        triggerNode.parentElement || document.body
      }
    />
  );
}

export default CreatableSelectField;
