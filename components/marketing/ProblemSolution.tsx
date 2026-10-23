import { Check, Clock, HeartPulse, Repeat } from "lucide-react";
import { Accent, Reveal, SectionHeading } from "@/components/marketing/shared";

const PROBLEMS = [
  {
    n: "01",
    icon: Clock,
    title: "Not enough chances to speak",
    body: "In a group class, speaking time is shared. Most students spend far more time listening than talking.",
  },
  {
    n: "02",
    icon: HeartPulse,
    title: "Fear of getting it wrong",
    body: "Real conversations feel high-stakes. Worrying about mistakes makes people go quiet when it matters most.",
  },
  {
    n: "03",
    icon: Repeat,
    title: "Forgetting between lessons",
    body: "New phrases fade fast without practice. A week between classes is a long time for a new expression.",
  },
];

export function ProblemSolution() {
  return (
    <section aria-labelledby="problem-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <SectionHeading
          id="problem-title"
          eyebrow="The gap"
          title={
            <>
              Knowing a language isn&apos;t the same as <Accent>speaking</Accent> it.
            </>
          }
        />
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.06} className="bg-paper">
            <article className="flex h-full flex-col p-7 lg:p-9">
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl italic text-brand/80">{p.n}</span>
                <p.icon className="size-5 text-slate" aria-hidden />
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <div className="grid items-center gap-10 rounded-3xl bg-ink p-8 text-white sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:p-14">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-lime">The Fluently way</p>
            <p className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
              A patient speaking partner for the days between your lessons.
            </p>
            <ul className="mt-8 space-y-3.5 text-white/80">
              {[
                "Practise real-life scenarios in a low-pressure space.",
                "Get gentle, specific feedback after every answer.",
                "Bring what you practised back to class — your teacher sees it too.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* mini timeline snippet */}
          <div className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10" aria-label="Example week combining classes and practice">
            <p className="text-xs uppercase tracking-wider text-white/60">A typical week with Fluently</p>
            <ol className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px]">
              {[
                ["Mon", "class"],
                ["Tue", "ai"],
                ["Wed", "ai"],
                ["Thu", "class"],
                ["Fri", "ai"],
                ["Sat", "rest"],
                ["Sun", "ai"],
              ].map(([d, t]) => (
                <li key={d} className="flex flex-col items-center gap-2">
                  <span
                    className={
                      t === "class"
                        ? "h-16 w-full rounded-lg bg-white"
                        : t === "ai"
                          ? "h-16 w-full rounded-lg bg-lime"
                          : "h-16 w-full rounded-lg border border-dashed border-white/25"
                    }
                    aria-hidden
                  />
                  <span className="text-white/70">{d}</span>
                  <span className="sr-only">{t === "class" ? "Class with teacher" : t === "ai" ? "AI practice" : "Rest"}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-white" aria-hidden /> Class with your teacher
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-lime" aria-hidden /> 10-min AI practice
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
