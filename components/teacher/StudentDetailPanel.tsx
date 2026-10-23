"use client";

import { ArrowRight, Clock, FileText, Lightbulb, MessageCircle, Send, Target, TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import type { PracticeSession, RosterStudent, ScenarioId } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Avatar, ScenarioIcon } from "@/components/ui/Brand";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";
import { ProgressBar } from "@/components/ui/Charts";
import { useToast } from "@/components/ui/Toast";
import { TutorAvatar } from "@/components/chat/MessageBubble";
import { SCENARIOS, getScenario } from "@/lib/scenarios";
import { STATUS_META, formatMinutes } from "@/lib/teacher";

export function StudentDetailPanel({ student, onClose }: { student: RosterStudent | null; onClose: () => void }) {
  // Keep showing the last student while the drawer animates out.
  const last = useRef(student);
  if (student) last.current = student;
  const shown = last.current;
  return (
    <Dialog open={student !== null} onClose={onClose} title={shown ? `${shown.name} — student details` : "Student details"} size="drawer" header={<span />}>
      {shown && <DetailBody key={shown.id} student={shown} />}
    </Dialog>
  );
}

function DetailBody({ student }: { student: RosterStudent }) {
  const { toast } = useToast();
  const [review, setReview] = useState<PracticeSession | null>(null);
  const [assign, setAssign] = useState<ScenarioId | "">("");
  const status = STATUS_META[student.status];
  const Trend = student.confidenceDelta >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="pb-8">
      <div className="border-b border-line bg-paper px-6 pb-6 pt-6 pr-14">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} className="size-14 text-lg" />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">{student.name}</h2>
            <p className="text-sm text-slate">{student.className} · last active {student.lastActiveLabel}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="brand">{student.level}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
          </div>
        </div>
        {student.attentionReason && (
          <p className="mt-4 rounded-xl bg-warn-50 px-3.5 py-2.5 text-sm text-warn">{student.attentionReason}</p>
        )}
      </div>

      <div className="space-y-7 px-6 pt-6">
        <dl className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line p-3">
            <dt className="flex items-center gap-1 text-xs text-slate"><Clock className="size-3" aria-hidden /> This week</dt>
            <dd className="mt-1 font-semibold tabular-nums">{formatMinutes(student.minutesThisWeek)}</dd>
          </div>
          <div className="rounded-xl border border-line p-3">
            <dt className="flex items-center gap-1 text-xs text-slate"><MessageCircle className="size-3" aria-hidden /> Sessions</dt>
            <dd className="mt-1 font-semibold tabular-nums">{student.sessionsThisWeek}</dd>
          </div>
          <div className="rounded-xl border border-line p-3">
            <dt className="flex items-center gap-1 text-xs text-slate"><Trend className="size-3" aria-hidden /> Confidence</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {student.confidence}
              <span className={student.confidenceDelta >= 0 ? "ml-1 text-xs text-success" : "ml-1 text-xs text-danger"}>
                {student.confidenceDelta >= 0 ? "+" : ""}
                {student.confidenceDelta}
              </span>
            </dd>
          </div>
        </dl>
        <ProgressBar value={student.confidence} label={`${student.name} speaking confidence`} />

        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate">
            <Lightbulb className="size-4" aria-hidden /> Learning insights
          </h3>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Target className="size-4 text-brand" aria-hidden /> Focus area: <span className="font-medium">{student.focusArea}</span>
          </p>
          <ul className="mt-3 space-y-2">
            {student.insights.map((i) => (
              <li key={i} className="rounded-xl bg-paper px-3.5 py-2.5 text-sm text-ink-2">{i}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate">Recent practice sessions</h3>
          <ul className="mt-3 space-y-2.5">
            {student.sessions.map((ses) => {
              const sc = getScenario(ses.scenarioId);
              return (
                <li key={ses.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                      <ScenarioIcon icon={sc.icon} className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{sc.title} · {ses.level}</p>
                      <p className="text-xs text-slate">{ses.dateLabel} · {ses.minutes} min</p>
                      <p className="mt-1.5 text-sm text-ink-2">{ses.highlight}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setReview(ses)}>
                    <FileText className="size-3.5" aria-hidden /> Open conversation review
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-line p-4">
          <h3 className="font-semibold">Assign a scenario</h3>
          <form
            className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (!assign) {
                toast("Choose a scenario first", { tone: "warn" });
                return;
              }
              toast(`Assigned to ${student.name.split(" ")[0]} (demo)`, {
                body: `${getScenario(assign).title} — nothing is sent in this demo.`,
                tone: "success",
              });
              setAssign("");
            }}
          >
            <div className="flex-1">
              <SelectField label="Scenario" value={assign} onChange={(e) => setAssign(e.target.value as ScenarioId | "")}>
                <option value="">Select a scenario</option>
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </SelectField>
            </div>
            <Button type="submit">
              <Send className="size-4" aria-hidden /> Assign
            </Button>
          </form>
        </section>
      </div>

      <ConversationReview session={review} studentName={student.name} onClose={() => setReview(null)} />
    </div>
  );
}

function ConversationReview({ session, studentName, onClose }: { session: PracticeSession | null; studentName: string; onClose: () => void }) {
  const sc = session ? getScenario(session.scenarioId) : null;
  return (
    <Dialog
      open={session !== null}
      onClose={onClose}
      title={sc ? `Conversation review: ${sc.title}` : "Conversation review"}
      description={session ? `${studentName} · ${session.dateLabel} · ${session.minutes} min · ${session.level}` : undefined}
      size="xl"
    >
      {session && (
        <div className="space-y-6 px-6 pb-6 pt-4">
          <DemoBadge label="Sample transcript — illustrative demo data" />
          <ol className="space-y-3 rounded-2xl bg-paper p-4">
            {session.transcript.map((line, i) =>
              line.role === "ai" ? (
                <li key={i} className="flex items-end gap-2.5">
                  <TutorAvatar className="size-7" />
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-2 text-sm">
                    <span className="sr-only">AI tutor: </span>{line.text}
                  </p>
                </li>
              ) : (
                <li key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-sm text-white">
                    <span className="sr-only">{studentName}: </span>{line.text}
                  </p>
                </li>
              ),
            )}
          </ol>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate">Key correction</p>
              <p className="mt-2 text-sm text-slate line-through decoration-danger/40">{session.correction.original}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                <ArrowRight className="size-3.5 text-success" aria-hidden /> {session.correction.suggestion}
              </p>
              <p className="mt-2 text-[13px] text-slate">{session.correction.explanation}</p>
            </div>
            <div className="rounded-2xl border border-line bg-lime-soft/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-lime-ink">Suggested follow-up for class</p>
              <p className="mt-2 text-sm text-ink-2">{session.teacherNote}</p>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
