"use client";

import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, MessagesSquare, Plane, Presentation, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Field";
import { DemoBadge } from "@/components/ui/Badge";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/cn";
import { LEVELS, type Level, type ScenarioId } from "@/types";

type Role = "student" | "teacher";
type Goal = "work" | "travel" | "exams" | "everyday";

const GOALS: { id: Goal; label: string; icon: LucideIcon; scenario: ScenarioId }[] = [
  { id: "work", label: "Work & career", icon: Briefcase, scenario: "job-interview" },
  { id: "travel", label: "Travel", icon: Plane, scenario: "airport" },
  { id: "exams", label: "Exams (IELTS)", icon: GraduationCap, scenario: "ielts" },
  { id: "everyday", label: "Everyday life", icon: MessagesSquare, scenario: "small-talk" },
];

export function OnboardingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Get started with Fluently" description="Pick a path to explore the demo — no account needed." size="lg">
      <OnboardingFlow onClose={onClose} />
    </Dialog>
  );
}

function OnboardingFlow({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { startConversation } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [goal, setGoal] = useState<Goal>("work");
  const [level, setLevel] = useState<Level>("B1");

  function chooseRole(r: Role) {
    setRole(r);
    setStep(2);
  }

  function openDashboard(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <div className="px-6 pb-6 pt-5">
      <div className="mb-5 flex items-center gap-2" aria-label={`Step ${step} of 2`}>
        <span className={cn("h-1 flex-1 rounded-full", "bg-brand")} />
        <span className={cn("h-1 flex-1 rounded-full transition-colors", step === 2 ? "bg-brand" : "bg-line")} />
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-[15px] font-medium text-ink">How will you use Fluently?</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "student", title: "I'm a student", body: "Practise real conversations between lessons.", icon: GraduationCap },
                { id: "teacher", title: "I'm a teacher", body: "See how your students are progressing.", icon: Presentation },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-autofocus={opt.id === "student" ? true : undefined}
                onClick={() => chooseRole(opt.id)}
                className="group rounded-2xl border border-line bg-white p-5 text-left transition hover:border-brand/50 hover:shadow-soft"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <opt.icon className="size-5" aria-hidden />
                </span>
                <span className="mt-4 block font-semibold">{opt.title}</span>
                <span className="mt-1 block text-sm text-slate">{opt.body}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Continue <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && role === "student" && (
        <div>
          <h3 className="text-[15px] font-medium text-ink">What are you practising for?</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={goal === g.id}
                onClick={() => setGoal(g.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition",
                  goal === g.id ? "border-brand bg-brand-50 text-brand-700" : "border-line bg-white hover:border-line-strong",
                )}
              >
                <g.icon className="size-4 shrink-0" aria-hidden />
                {g.label}
              </button>
            ))}
          </div>
          <h3 className="mt-5 text-[15px] font-medium text-ink">Your current level</h3>
          <Segmented
            className="mt-2"
            legend="Current English level"
            name="onboarding-level"
            value={level}
            onChange={setLevel}
            options={LEVELS.map((l) => ({ value: l, label: l }))}
          />
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4" aria-hidden /> Back
            </Button>
            <div className="flex-1" />
            <Button variant="secondary" onClick={() => openDashboard("/demo/student")}>
              Open student dashboard
            </Button>
            <Button onClick={() => startConversation(GOALS.find((g) => g.id === goal)!.scenario, level)}>
              Start a practice conversation
            </Button>
          </div>
        </div>
      )}

      {step === 2 && role === "teacher" && (
        <div>
          <h3 className="text-[15px] font-medium text-ink">Your teacher workspace is ready</h3>
          <p className="mt-1 text-sm text-slate">
            Explore a sample school with 12 students, practice analytics and conversation reviews.
          </p>
          <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                ["48", "Students"],
                ["31", "Active this week"],
                ["4", "Need attention"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xs text-slate">{l}</dt>
                  <dd className="text-xl font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <DemoBadge label="Illustrative demo data" className="mt-3" />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4" aria-hidden /> Back
            </Button>
            <div className="flex-1" />
            <Button data-autofocus onClick={() => openDashboard("/demo/teacher")}>
              Open teacher dashboard <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
