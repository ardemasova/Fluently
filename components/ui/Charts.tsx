import type { DayActivity } from "@/types";
import { cn } from "@/lib/cn";

/** Accessible CSS bar chart for a week of activity. */
export function WeeklyBars({
  data,
  unit = "min",
  highlightIndex,
  className,
  barClassName = "bg-brand",
  height = "h-36",
  caption,
}: {
  data: DayActivity[];
  unit?: string;
  highlightIndex?: number;
  className?: string;
  barClassName?: string;
  height?: string;
  caption: string;
}) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  return (
    <figure className={className}>
      <figcaption className="sr-only">{caption}</figcaption>
      <div className={cn("flex items-end gap-2 sm:gap-3", height)}>
        {data.map((d, i) => {
          const pct = (d.minutes / max) * 100;
          return (
            <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                {d.minutes} {unit}
              </span>
              <div
                className={cn(
                  "w-full rounded-md transition-[height] duration-700",
                  d.minutes === 0 ? "h-1 bg-line" : barClassName,
                  highlightIndex !== undefined && i !== highlightIndex && d.minutes > 0 && "opacity-45",
                )}
                style={d.minutes > 0 ? { height: `${Math.max(pct, 4)}%` } : undefined}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d) => (
          <span key={d.day} className="flex-1 text-center text-xs text-slate">
            {d.day}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <thead>
          <tr>
            <th>Day</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{d.day}</td>
              <td>
                {d.minutes} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Circular progress meter. */
export function Ring({
  value,
  size = 88,
  stroke = 8,
  label,
  className,
  trackClass = "text-mist",
  barClass = "text-brand",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  className?: string;
  trackClass?: string;
  barClass?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="currentColor" className={trackClass} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          className={cn("transition-[stroke-dashoffset] duration-700", barClass)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function ProgressBar({ value, className, barClass = "bg-brand", label }: { value: number; className?: string; barClass?: string; label: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-mist", className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700", barClass)} style={{ width: `${v}%` }} />
    </div>
  );
}
