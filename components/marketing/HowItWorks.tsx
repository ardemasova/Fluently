import { BookOpen, Briefcase, Coffee, Plane, PenLine, Sparkles } from "lucide-react";
import { Waveform } from "@/components/ui/Brand";
import { TutorAvatar } from "@/components/chat/MessageBubble";
import { Accent, Reveal, SectionHeading } from "@/components/marketing/shared";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-y border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title={
              <>
                Three steps. <Accent>Ten minutes.</Accent> Any day you like.
              </>
            }
          />
        </Reveal>

        <ol className="relative mt-16 grid gap-6 lg:grid-cols-3">
          {/* connector line */}
          <span className="absolute left-0 right-0 top-[22px] hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-line-strong)_0_6px,transparent_6px_12px)] lg:block" aria-hidden />

          <Step n={1} title="Choose your scenario" body="Practise job interviews, travel, everyday conversations, or professional English.">
            <div className="space-y-2">
              {[
                { icon: Briefcase, label: "Job interview", meta: "B2 · 12 min", active: true },
                { icon: Plane, label: "Airport and travel", meta: "B1 · 8 min" },
                { icon: Coffee, label: "Coffee shop", meta: "A2 · 5 min" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={
                    s.active
                      ? "flex items-center gap-3 rounded-xl border-2 border-brand bg-brand-50/60 px-3 py-2.5"
                      : "flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5"
                  }
                >
                  <s.icon className={s.active ? "size-4 text-brand" : "size-4 text-slate"} aria-hidden />
                  <span className="flex-1 text-sm font-medium">{s.label}</span>
                  <span className="text-xs text-slate">{s.meta}</span>
                </div>
              ))}
            </div>
          </Step>

          <Step n={2} title="Start talking" body="Have a natural conversation with your AI speaking partner — at your level, at your pace.">
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <TutorAvatar className="size-7" />
                <p className="rounded-2xl rounded-bl-md border border-line bg-white px-3 py-2 text-[13px]">
                  Why are you interested in this role?
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-ink px-3 py-2.5 text-lime">
                <Waveform bars={26} className="h-7 flex-1" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">Speaking</span>
              </div>
            </div>
          </Step>

          <Step n={3} title="Get better every time" body="Receive a personalized review with corrections, new vocabulary and what to practise next.">
            <div className="rounded-xl border border-line bg-white p-3.5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate">Session review</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11.5px] font-medium text-brand-700">
                  <Sparkles className="size-3" aria-hidden /> Natural expression
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-warn-50 px-2 py-0.5 text-[11.5px] font-medium text-warn">
                  <PenLine className="size-3" aria-hidden /> Grammar tip
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-soft px-2 py-0.5 text-[11.5px] font-medium text-lime-ink">
                  <BookOpen className="size-3" aria-hidden /> New vocabulary
                </span>
              </div>
              <p className="mt-3 text-[13px] text-slate">
                <span className="text-ink line-through decoration-danger/40">I work there since 2021</span>
                <br />
                <span className="font-medium text-ink">I&apos;ve worked there since 2021</span>
              </p>
            </div>
          </Step>
        </ol>
      </div>
    </section>
  );
}

function Step({ n, title, body, children }: { n: number; title: string; body: string; children: React.ReactNode }) {
  return (
    <li className="relative">
      <Reveal delay={(n - 1) * 0.08}>
        <span className="relative z-10 grid size-11 place-items-center rounded-full bg-ink font-mono text-sm font-medium text-lime ring-8 ring-white">
          0{n}
        </span>
        <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-sm leading-relaxed text-slate">{body}</p>
        <div className="mt-6 rounded-2xl border border-line bg-paper p-4" aria-hidden>
          {children}
        </div>
      </Reveal>
    </li>
  );
}
