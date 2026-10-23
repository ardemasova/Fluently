import { BookOpen, Clock, Lightbulb, MessageCircle, Target, TrendingUp } from "lucide-react";
import { DEMO_STUDENT, STUDENT_INSIGHTS, STUDENT_WEEK } from "@/lib/mock-data";
import { ProgressBar, Ring, WeeklyBars } from "@/components/ui/Charts";
import { DemoBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Accent, Reveal, SectionHeading } from "@/components/marketing/shared";

const INSIGHT_LABEL = { strength: "Strength", focus: "Focus area", next: "Next step" } as const;

export function ProgressSection() {
  const s = DEMO_STUDENT;
  const goalPct = (s.minutesThisWeek / s.weeklyGoalMin) * 100;

  return (
    <section aria-labelledby="progress-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="progress-title"
          eyebrow="Progress"
          title={
            <>
              Every conversation <Accent>moves you</Accent> forward.
            </>
          }
          lead="See how much you're speaking, the words you're picking up and what to focus on next."
        />
        <LinkButton href="/demo/student" variant="secondary" className="self-start md:self-auto">
          Open the student demo
        </LinkButton>
      </Reveal>

      <Reveal className="mt-12">
        <div className="rounded-3xl border border-line bg-white p-4 shadow-lift sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-4">
            <p className="font-semibold">Lucía&apos;s week</p>
            <DemoBadge label="Illustrative demo data" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-2xl bg-paper p-5">
              <Ring value={s.confidence} label="Speaking confidence" size={76}>
                <span className="text-lg font-semibold tabular-nums">{s.confidence}</span>
              </Ring>
              <div>
                <p className="text-sm text-slate">Speaking confidence</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-success">
                  <TrendingUp className="size-3.5" aria-hidden /> +6 this month
                </p>
                <p className="mt-0.5 text-[11px] text-slate">Self-rated, after each session</p>
              </div>
            </div>
            <Stat icon={Clock} label="Minutes practiced this week" value={`${s.minutesThisWeek}`} sub={<ProgressBar value={goalPct} label="Weekly goal progress" className="mt-2" />} />
            <Stat icon={MessageCircle} label="Conversations completed" value={`${s.conversationsCompleted}`} sub={<span className="text-sm text-slate">7 this week</span>} />
            <Stat icon={BookOpen} label="Vocabulary learned" value={`${s.wordsLearned}`} sub={<span className="text-sm text-slate">+18 new words</span>} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium">Weekly activity</p>
                <p className="flex items-center gap-1.5 text-sm text-slate">
                  <Target className="size-4" aria-hidden /> Goal {s.weeklyGoalMin} min
                </p>
              </div>
              <WeeklyBars data={STUDENT_WEEK} className="mt-8" height="h-52" caption="Minutes practised each day this week" />
            </div>

            <div className="rounded-2xl border border-line p-5">
              <p className="flex items-center gap-2 font-medium">
                <Lightbulb className="size-4 text-warn" aria-hidden /> Recent learning insights
              </p>
              <ul className="mt-4 space-y-3">
                {STUDENT_INSIGHTS.map((i) => (
                  <li key={i.id} className="rounded-xl bg-paper px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-brand">{INSIGHT_LABEL[i.kind]}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-paper p-5">
      <p className="flex items-center gap-2 text-sm text-slate">
        <Icon className="size-4" aria-hidden /> {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-1">{sub}</div>
    </div>
  );
}
