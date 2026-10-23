import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "brand" | "lime" | "success" | "warn" | "danger" | "dark" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-mist text-ink-2",
  brand: "bg-brand-50 text-brand-700",
  lime: "bg-lime-soft text-lime-ink",
  success: "bg-success-50 text-success",
  warn: "bg-warn-50 text-warn",
  danger: "bg-danger-50 text-danger",
  dark: "bg-ink text-white",
  outline: "border border-line text-slate bg-white",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function DemoBadge({ label = "Demo environment", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand/40 bg-brand-50/70 px-2.5 py-0.5 text-xs font-medium text-brand-700",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {label}
    </span>
  );
}
