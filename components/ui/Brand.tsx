import { Briefcase, Coffee, GraduationCap, MessagesSquare, Plane, Presentation, type LucideProps } from "lucide-react";
import type { IconKey } from "@/types";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#5146E5" />
      {/* speech bubble */}
      <path
        d="M9 10.5c0-1.4 1.1-2.5 2.5-2.5h9c1.4 0 2.5 1.1 2.5 2.5v6.5c0 1.4-1.1 2.5-2.5 2.5h-5.2l-3.6 3.1c-.4.3-.9 0-.9-.4v-2.7h0c-1 0-1.8-.8-1.8-1.8V10.5Z"
        fill="#fff"
      />
      {/* voice bars */}
      <rect x="12.4" y="12.2" width="1.8" height="3.6" rx=".9" fill="#5146E5" />
      <rect x="15.1" y="10.8" width="1.8" height="6.4" rx=".9" fill="#5146E5" />
      <rect x="17.8" y="12.6" width="1.8" height="2.8" rx=".9" fill="#5146E5" />
      <circle cx="24.5" cy="24" r="3" fill="#D5F36A" />
    </svg>
  );
}

export function Wordmark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("text-[19px] font-semibold tracking-[-0.03em]", inverted ? "text-white" : "text-ink")}>
        Fluently
      </span>
    </span>
  );
}

const ICONS: Record<IconKey, React.ComponentType<LucideProps>> = {
  coffee: Coffee,
  briefcase: Briefcase,
  plane: Plane,
  chat: MessagesSquare,
  presentation: Presentation,
  graduation: GraduationCap,
};

export function ScenarioIcon({ icon, ...props }: { icon: IconKey } & LucideProps) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden {...props} />;
}

/** Animated voice indicator. Purely decorative. */
export function Waveform({
  bars = 28,
  active = true,
  className,
  barClassName,
}: {
  bars?: number;
  active?: boolean;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("flex h-10 items-center gap-[3px]", className)} aria-hidden>
      {Array.from({ length: bars }, (_, i) => {
        // deterministic pseudo-random heights for a natural shape
        const h = 30 + ((i * 37) % 70);
        return (
          <span
            key={i}
            className={cn("w-[3px] origin-center rounded-full bg-current", active && "animate-wave", barClassName)}
            style={{
              height: `${h}%`,
              animationDelay: `${(i % 7) * 0.11 + (i % 3) * 0.05}s`,
              transform: active ? undefined : "scaleY(0.35)",
            }}
          />
        );
      })}
    </div>
  );
}

export function Avatar({ name, className, tone = "brand" }: { name: string; className?: string; tone?: "brand" | "lime" | "ink" | "mist" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    lime: "bg-lime text-ink",
    ink: "bg-ink text-white",
    mist: "bg-mist text-ink-2",
  };
  return (
    <span
      className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold", tones[tone], className)}
      aria-hidden
    >
      {initials}
    </span>
  );
}
