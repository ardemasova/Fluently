import { BookOpen, Check, PenLine, Sparkles, type LucideIcon } from "lucide-react";
import type { ChatMessage, Feedback, FeedbackKind } from "@/types";
import { cn } from "@/lib/cn";

export const FEEDBACK_STYLE: Record<FeedbackKind, { icon: LucideIcon; chip: string }> = {
  natural: { icon: Sparkles, chip: "bg-brand-50 text-brand-700" },
  grammar: { icon: PenLine, chip: "bg-warn-50 text-warn" },
  vocabulary: { icon: BookOpen, chip: "bg-lime-soft text-lime-ink" },
  encouragement: { icon: Check, chip: "bg-success-50 text-success" },
};

export function FeedbackChip({ feedback, className }: { feedback: Pick<Feedback, "kind" | "label">; className?: string }) {
  const { icon: Icon, chip } = FEEDBACK_STYLE[feedback.kind];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium", chip, className)}>
      <Icon className="size-3" aria-hidden />
      {feedback.label}
    </span>
  );
}

export function TutorAvatar({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime", className)} aria-hidden>
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
        <rect x="2" y="6" width="2" height="4" rx="1" />
        <rect x="5.5" y="3" width="2" height="10" rx="1" />
        <rect x="9" y="5" width="2" height="6" rx="1" />
        <rect x="12.5" y="7" width="2" height="2" rx="1" />
      </svg>
    </span>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "ai") {
    return (
      <div className="flex max-w-[88%] items-end gap-2.5">
        <TutorAvatar />
        <div>
          <span className="sr-only">AI tutor said:</span>
          <p className="rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-[15px] leading-relaxed text-ink shadow-[0_1px_0_rgb(23_35_61/0.03)]">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-auto flex max-w-[88%] flex-col items-end gap-1.5">
      <span className="sr-only">You said:</span>
      <p className="whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-[15px] leading-relaxed text-white">
        {message.text}
      </p>
      {message.feedback && message.feedback.length > 0 && (
        <div className="w-full max-w-sm space-y-1.5">
          {message.feedback.map((f, i) => (
            <div key={i} className="rounded-xl border border-line bg-white px-3 py-2 text-[13px] leading-snug text-slate">
              <FeedbackChip feedback={f} />
              <p className="mt-1">{f.detail}</p>
              {f.suggestion && <p className="mt-1 font-medium text-ink">{f.suggestion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5" role="status" aria-label="AI tutor is typing">
      <TutorAvatar />
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 animate-blink rounded-full bg-slate" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}
