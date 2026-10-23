import { ArrowRight, BookOpen, Check, Clock, MessageCircle, PenLine, RotateCcw } from "lucide-react";
import type { SessionSummary as Summary } from "@/types";
import { getScenario } from "@/lib/scenarios";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/Badge";
import { ScenarioIcon } from "@/components/ui/Brand";

export function SessionSummary({
  summary,
  onRestart,
  onNext,
  onClose,
}: {
  summary: Summary;
  onRestart: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const scenario = getScenario(summary.scenarioId);
  const next = getScenario(summary.nextScenarioId);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl px-5 py-7 sm:px-8">
        <DemoBadge label="Illustrative demo feedback — not a real assessment" />
        <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Nice work — here&apos;s your session review</h3>
        <p className="mt-1.5 text-slate">
          {scenario.title} · {summary.level}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-2.5">
          {[
            { icon: MessageCircle, label: "Your turns", value: summary.studentTurns },
            { icon: PenLine, label: "Words spoken", value: summary.studentWords },
            { icon: Clock, label: "Minutes", value: summary.minutes },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-paper px-3 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate">
                <s.icon className="size-3.5" aria-hidden /> {s.label}
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        {summary.studentTurns === 0 && (
          <p className="mt-4 rounded-xl bg-warn-50 px-4 py-3 text-sm text-warn">
            You ended the session before replying, so this review shows what the scenario covers.
          </p>
        )}

        <section className="mt-7">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate">What you practised</h4>
          <ul className="mt-3 space-y-2">
            {summary.practiced.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[15px]">
                <span className="grid size-5 place-items-center rounded-full bg-lime text-ink">
                  <Check className="size-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate">
            {summary.correctionFromSession ? "A useful correction from your session" : "A common correction in this scenario"}
          </h4>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line">
            <p className="border-b border-line bg-danger-50/50 px-4 py-3 text-[15px] text-ink-2">
              <span className="mr-2 text-xs font-medium uppercase tracking-wider text-danger">You said</span>
              <span className="line-through decoration-danger/40">{summary.correction.original}</span>
            </p>
            <p className="bg-success-50/60 px-4 py-3 text-[15px] font-medium">
              <span className="mr-2 text-xs font-medium uppercase tracking-wider text-success">Try</span>
              {summary.correction.suggestion}
            </p>
            <p className="px-4 py-3 text-sm text-slate">{summary.correction.explanation}</p>
          </div>
        </section>

        <section className="mt-7">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate">Vocabulary to try next time</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {summary.vocabulary.map((v) => (
              <div key={v.word} className="rounded-2xl border border-line bg-white p-4">
                <p className="flex items-center gap-2 font-semibold">
                  <BookOpen className="size-4 text-brand" aria-hidden /> {v.word}
                </p>
                <p className="mt-1 text-sm text-slate">{v.definition}</p>
                <p className="mt-2 text-sm italic text-ink-2">“{v.example}”</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-2xl bg-ink p-5 text-white">
          <h4 className="text-sm font-medium text-white/70">Suggested next scenario</h4>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-lime">
              <ScenarioIcon icon={next.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{next.title}</p>
              <p className="text-sm text-white/70">
                {next.durationMin} min · {next.description}
              </p>
            </div>
            <Button variant="lime" onClick={onNext}>
              Start <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </section>

        <div className="mt-6 flex flex-col-reverse gap-2 pb-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            <RotateCcw className="size-4" aria-hidden /> Practise again
          </Button>
        </div>
      </div>
    </div>
  );
}
