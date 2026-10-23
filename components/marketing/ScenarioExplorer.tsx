"use client";

import { ArrowRight, Check, Clock, UserRound } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { SCENARIOS, getScenario } from "@/lib/scenarios";
import { LEVELS, type Level, type ScenarioId } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Segmented } from "@/components/ui/Field";
import { ScenarioIcon } from "@/components/ui/Brand";
import { useApp } from "@/components/providers/AppProvider";
import { Reveal, SectionHeading } from "@/components/marketing/shared";
import { cn } from "@/lib/cn";

const LEVEL_NOTES: Record<Level, string> = {
  A2: "Short, simple questions with sentence starters.",
  B1: "Everyday pace with optional sentence starters.",
  B2: "Natural pace, follow-up questions, no hints.",
  C1: "Extra challenges and more nuanced follow-ups.",
};

export function ScenarioExplorer() {
  const { startConversation } = useApp();
  const [selected, setSelected] = useState<ScenarioId>("job-interview");
  const [level, setLevel] = useState<Level>("B2");
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = getScenario(selected);

  function select(id: ScenarioId) {
    setSelected(id);
    setLevel(getScenario(id).recommendedLevel);
  }

  // Arrow-key navigation for the radiogroup.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const idx = SCENARIOS.findIndex((s) => s.id === selected);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % SCENARIOS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + SCENARIOS.length) % SCENARIOS.length;
    if (next >= 0) {
      e.preventDefault();
      select(SCENARIOS[next].id);
      cardRefs.current[next]?.focus();
    }
  }

  return (
    <section id="practice" aria-labelledby="practice-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="practice-title"
          eyebrow="Try it now"
          title="What do you want to practice today?"
          lead="Pick a scenario and a level, then start a short demo conversation. No sign-up needed."
        />
        <DemoBadge label="Interactive demo" className="self-start md:self-auto" />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div
          role="radiogroup"
          aria-label="Practice scenarios"
          onKeyDown={onKeyDown}
          className="grid gap-3 sm:grid-cols-2"
        >
          {SCENARIOS.map((s, i) => {
            const active = s.id === selected;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => select(s.id)}
                className={cn(
                  "group relative flex flex-col rounded-2xl border bg-white p-5 text-left transition-[border-color,box-shadow,transform] duration-200",
                  active
                    ? "border-brand shadow-[0_0_0_1px_var(--color-brand),var(--shadow-lift)]"
                    : "border-line hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft",
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-xl transition-colors",
                      active ? "bg-brand text-white" : "bg-mist text-ink-2 group-hover:bg-brand-50 group-hover:text-brand",
                    )}
                  >
                    <ScenarioIcon icon={s.icon} className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full border transition",
                      active ? "border-brand bg-brand text-white" : "border-line-strong text-transparent",
                    )}
                    aria-hidden
                  >
                    <Check className="size-3.5" />
                  </span>
                </div>
                <span className="mt-5 text-[17px] font-semibold tracking-tight">{s.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate">{s.description}</span>
                <span className="mt-4 flex items-center gap-2 text-xs text-slate">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden /> ~{s.durationMin} min
                  </span>
                  <span aria-hidden>·</span>
                  <Badge tone={active ? "brand" : "neutral"}>{s.recommendedLevel}</Badge>
                  <span className="sr-only">recommended level</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Session setup */}
        <aside aria-label="Session setup" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-slate">Your session</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-ink text-lime">
                <ScenarioIcon icon={scenario.icon} className="size-5" />
              </span>
              <div>
                <p className="text-lg font-semibold leading-tight tracking-tight" aria-live="polite">
                  {scenario.title}
                </p>
                <p className="text-sm text-slate">{scenario.category} · ~{scenario.durationMin} min</p>
              </div>
            </div>

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-paper px-3 py-2.5 text-sm text-ink-2">
              <UserRound className="mt-0.5 size-4 shrink-0 text-slate" aria-hidden />
              <span>
                <span className="text-slate">Your AI tutor plays:</span> {scenario.role}
              </span>
            </p>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium" id="level-label">
                English level
              </p>
              <Segmented
                legend="English level"
                name="explorer-level"
                value={level}
                onChange={setLevel}
                options={LEVELS.map((l) => ({ value: l, label: l }))}
              />
              <p className="mt-2 text-[13px] text-slate">{LEVEL_NOTES[level]}</p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium">You&apos;ll practise</p>
              <ul className="mt-2 space-y-1.5">
                {scenario.skills.map((sk) => (
                  <li key={sk} className="flex items-center gap-2 text-sm text-slate">
                    <span className="size-1.5 rounded-full bg-brand" aria-hidden /> {sk}
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" className="mt-6 w-full" onClick={() => startConversation(selected, level)}>
              Start conversation <ArrowRight className="size-4" aria-hidden />
            </Button>
            <p className="mt-3 text-center text-xs text-slate">Text-based demo · scripted replies, no AI model connected</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
