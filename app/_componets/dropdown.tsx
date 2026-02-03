"use client";

import * as React from "react";
import { Control, FieldValues, Path, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string; // for trigger styling
  disabled?: boolean;
  error?: string;
};

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled,
  error,
}: FormSelectProps<T>) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </label>
      ) : null}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ""} // keep controlled
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={className ?? "h-14 rounded-lg"}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
