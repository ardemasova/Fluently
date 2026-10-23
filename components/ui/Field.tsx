"use client";

import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "block w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink placeholder:text-slate/70 transition-[border-color,box-shadow] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  labelAside?: ReactNode;
  children: ReactNode;
}

export function FieldShell({ id, label, error, hint, labelAside, children }: FieldShellProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-slate">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  labelAside?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, labelAside, id: idProp, className, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} labelAside={labelAside}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputBase, "h-11", error ? "border-danger/70" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
});

export const PasswordField = forwardRef<HTMLInputElement, Omit<TextFieldProps, "type">>(function PasswordField(
  { label, error, hint, labelAside, id: idProp, className, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} labelAside={labelAside}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(inputBase, "h-11 pr-11", error ? "border-danger/70" : "border-line", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate hover:bg-mist hover:text-ink"
        >
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    </FieldShell>
  );
});

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, id: idProp, className, children, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error}>
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputBase, "h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10", error ? "border-danger/70" : "border-line", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23586178' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
});

export function TextAreaField({
  label,
  error,
  id: idProp,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputBase, "min-h-24 resize-y py-2.5", error ? "border-danger/70" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}

/** Segmented radio group used for role and level pickers. */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
  className,
  size = "md",
}: {
  legend: string;
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  name: string;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex gap-1 rounded-xl border border-line bg-mist/70 p-1">
        {options.map((opt) => {
          const checked = opt.value === value;
          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                size === "sm" ? "h-8 px-2.5 text-[13px]" : "h-9 px-3 text-sm",
                checked ? "bg-white text-ink shadow-soft" : "text-slate hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
