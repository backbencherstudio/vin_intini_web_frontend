"use client";

import type { SelectProps } from "antd";
import { Select } from "antd";
import { useMemo, useState } from "react";

type SmartSelectFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  options: SelectProps["options"];
  placeholder: string;
  className?: string;
  allowCustomInput?: boolean;
};

function normalizeOption(option: any): { value: string; label: string }[] {
  if (!option) return [];
  if (Array.isArray(option.options)) {
    return option.options.flatMap((nested: any) => normalizeOption(nested));
  }
  return [
    {
      value: String(option.value ?? ""),
      label: String(option.label ?? option.value ?? ""),
    },
  ];
}

function SmartSelectField({
  value,
  onChange,
  options,
  placeholder,
  className,
  allowCustomInput = false,
}: SmartSelectFieldProps) {
  const [search, setSearch] = useState("");

  const flatOptions = useMemo(() => {
    if (!options) return [];
    return options.flatMap((option: any) => normalizeOption(option));
  }, [options]);

  const mergedOptions = useMemo(() => {
    if (!allowCustomInput) return options;

    const typedValue = search.trim();
    if (!typedValue) return options;

    const matched = flatOptions.some((option) => {
      const searchValue = typedValue.toLowerCase();
      return (
        option.label.toLowerCase() === searchValue ||
        option.value.toLowerCase() === searchValue
      );
    });

    if (matched) return options;

    return [...(options || []), { value: typedValue, label: typedValue }];
  }, [allowCustomInput, search, flatOptions, options]);

  const commitCustomValue = () => {
    if (!allowCustomInput) return;

    const typedValue = search.trim();
    if (!typedValue) return;

    const matched = flatOptions.find((option) => {
      const searchValue = typedValue.toLowerCase();
      return (
        option.label.toLowerCase() === searchValue ||
        option.value.toLowerCase() === searchValue
      );
    });

    onChange(matched ? matched.value : typedValue);
    setSearch("");
  };

  return (
    <Select
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      value={value || undefined}
      onSearch={setSearch}
      onBlur={commitCustomValue}
      onChange={(nextValue) => {
        onChange(String(nextValue));
        setSearch("");
      }}
      options={mergedOptions}
      size="large"
      className={className}
    />
  );
}

export default SmartSelectField;
