"use client";

import { ArrowRight, BookOpen, Check, Clock, Flame, LayoutDashboard, MessageCircle, Play, RotateCcw, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell, Card, PageHeader } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { ScenarioIcon } from "@/components/ui/Brand";
import { ProgressBar, Ring, WeeklyBars } from "@/components/ui/Charts";
import { Segmented } from "@/components/ui/Field";
import { useApp } from "@/components/providers/AppProvider";
import { DEMO_STUDENT, RECENT_CONVERSATIONS, RECOMMENDED_FOR_STUDENT, STUDENT_INSIGHTS, STUDENT_WEEK, VOCAB_REVIEW } from "@/lib/mock-data";
import { SCENARIOS, getScenario } from "@/lib/scenarios";
import { LEVELS, type Level, type RecentConversation } from "@/types";
import { cn } from "@/lib/cn";

type View = "overview" | "practice" | "vocabulary" | "history";

const NAV: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "practice", label: "Practice", icon: Play },
  { id: "vocabulary", label: "Vocabulary", icon: BookOpen },
  { id: "history", label: "Conversations", icon: MessageCircle },
];

function relativeTime(ts: number): string {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

export function StudentDashboard() {
  const [view, setView] = useState<View>("overview");
  const { completedSessions } = useApp();

  const conversations: (RecentConversation & { fresh?: boolean })[] = useMemo(
    () => [
      ...completedSessions.map((c) => ({
        id: c.id,
        scenarioId: c.scenarioId,
        level: c.level,
        dateLabel: relativeTime(c.endedAt),
        minutes: c.minutes,
        takeaway: `${c.studentTurns} ${c.studentTurns === 1 ? "turn" : "turns"} completed in this demo session.`,
        fresh: true,
      })),
      ...RECENT_CONVERSATIONS,
    ],
    [completedSessions],
  );

  return (
    <DashboardShell
      nav={NAV}
      active={view}
      onNavigate={setView}
      user={{ name: DEMO_STUDENT.fullName, meta: `Student · ${DEMO_STUDENT.level} · demo account` }}
      switchTo={{ href: "/demo/teacher", label: "Switch to teacher demo" }}
    >
      {view === "overview" && <Overview conversations={conversations} onNavigate={setView} />}
      {view === "practice" && <PracticeView />}
      {view === "vocabulary" && <VocabularyView />}
      {view === "history" && <HistoryView conversations={conversations} />}
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */

function Overview({ conversations, onNavigate }: { conversations: RecentConversation[]; onNavigate: (v: View) => void }) {
  const { startConversation } = useApp();
  const s = DEMO_STUDENT;
  const last = conversations[0];
  const goalPct = Math.round((s.minutesThisWeek / s.weeklyGoalMin) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={<>Good to see you, {s.firstName}</>}
        subtitle={`${s.weeklyGoalMin - s.minutesThisWeek} minutes to go to hit this week's goal.`}
        actions={
          <Button onClick={() => (last ? startConversation(last.scenarioId, last.level) : onNavigate("practice"))}>
            <Play className="size-4" aria-hidden /> Continue practicing
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-sm text-white/70">Current level</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">{s.level}</span>
            <span className="text-sm text-white/70">→ {s.targetLevel} goal</span>
          </p>
          <ProgressBar value={62} barClass="bg-lime" className="mt-4 bg-white/15" label="Progress towards B2" />
          <p className="mt-2 text-xs text-white/60">Set with your teacher, {s.teacher}</p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
          <Ring value={goalPct} label="Weekly speaking goal progress" size={80}>
            <span className="text-sm font-semibold tabular-nums">{goalPct}%</span>
          </Ring>
          <div>
            <p className="flex items-center gap-1.5 text-sm text-slate">
              <Target className="size-4" aria-hidden /> Weekly goal
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {s.minutesThisWeek}
              <span className="text-sm font-normal text-slate"> / {s.weeklyGoalMin} min</span>
            </p>
          </div>
        </div>

        <MiniStat icon={Flame} label="Practice streak" value={`${s.streakDays} days`} sub="Keep it going today" />
        <MiniStat icon={TrendingUp} label="Speaking confidence" value={`${s.confidence}/100`} sub="+6 this month (self-rated)" />
      </div>

      <Card
        title="Recommended for you"
        action={
          <button type="button" onClick={() => onNavigate("practice")} className="text-sm font-medium text-brand hover:underline underline-offset-4">
            All scenarios
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {RECOMMENDED_FOR_STUDENT.map((r) => {
            const sc = getScenario(r.scenarioId);
            return (
              <button
                key={r.scenarioId}
                type="button"
                onClick={() => startConversation(r.scenarioId, r.level)}
                className="group flex flex-col rounded-2xl border border-line bg-paper p-4 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-brand ring-1 ring-line transition group-hover:bg-brand group-hover:text-white">
                    <ScenarioIcon icon={sc.icon} className="size-4.5" />
                  </span>
                  <Badge tone="brand">{r.level}</Badge>
                </div>
                <span className="mt-4 font-semibold">{sc.title}</span>
                <span className="mt-1 text-sm text-slate">{r.reason}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Start · {sc.durationMin} min <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Card title="Progress this week" action={<DemoBadge label="Demo data" />}>
          <WeeklyBars data={STUDENT_WEEK} className="mt-6" caption="Minutes practised each day this week" />
          <div className="mt-6 rounded-xl bg-lime-soft px-4 py-3 text-sm text-lime-ink">
            <span className="font-semibold">Insight · </span>
            {STUDENT_INSIGHTS[0].text}
          </div>
        </Card>

        <Card
          title="Recent conversations"
          action={
            <button type="button" onClick={() => onNavigate("history")} className="text-sm font-medium text-brand hover:underline underline-offset-4">
              View all
            </button>
          }
        >
          <ConversationList items={conversations.slice(0, 3)} />
        </Card>
      </div>

      <Card
        title="Vocabulary review"
        action={
          <button type="button" onClick={() => onNavigate("vocabulary")} className="text-sm font-medium text-brand hover:underline underline-offset-4">
            Review all
          </button>
        }
      >
        <VocabGrid items={VOCAB_REVIEW.slice(0, 3)} />
      </Card>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="flex items-center gap-1.5 text-sm text-slate">
        <Icon className="size-4" aria-hidden /> {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-slate">{sub}</p>
    </div>
  );
}

function ConversationList({ items }: { items: (RecentConversation & { fresh?: boolean })[] }) {
  const { startConversation } = useApp();
  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-line-strong px-4 py-8 text-center text-sm text-slate">No conversations yet — start your first one!</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {items.map((c) => {
        const sc = getScenario(c.scenarioId);
        return (
          <li key={c.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-mist text-ink-2">
              <ScenarioIcon icon={sc.icon} className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {sc.title} <Badge>{c.level}</Badge>
                {c.fresh && <Badge tone="lime">New</Badge>}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-slate">{c.takeaway}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate">
                <Clock className="size-3" aria-hidden /> {c.dateLabel} · {c.minutes} min
              </p>
            </div>
            <button
              type="button"
              onClick={() => startConversation(c.scenarioId, c.level)}
              aria-label={`Practise ${sc.title} again`}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-slate hover:bg-mist hover:text-ink"
            >
              <RotateCcw className="size-4" aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function VocabGrid({ items }: { items: typeof VOCAB_REVIEW }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const knownCount = items.filter((v) => known[v.word]).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <ProgressBar value={(knownCount / items.length) * 100} label="Words marked as known" barClass="bg-success" className="max-w-48" />
        <span className="text-sm text-slate" aria-live="polite">
          {knownCount} of {items.length} marked as known
        </span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((v) => {
          const isOpen = revealed[v.word];
          const isKnown = known[v.word];
          return (
            <li
              key={v.word}
              className={cn(
                "flex flex-col rounded-2xl border p-4 transition",
                isKnown ? "border-success/30 bg-success-50/50" : isOpen ? "border-brand/30 bg-brand-50/40" : "border-line bg-paper",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-semibold tracking-tight">{v.word}</p>
                <Badge tone="outline">{getScenario(v.scenarioId).title.split(" ")[0]}</Badge>
              </div>
              <div id={`vocab-${v.word.replace(/\s+/g, "-")}`} className="mt-2 min-h-[72px] flex-1">
                {isOpen ? (
                  <>
                    <p className="text-sm text-ink-2">{v.definition}</p>
                    <p className="mt-2 text-sm italic text-slate">“{v.example}”</p>
                  </>
                ) : (
                  <p className="text-sm text-slate">Can you remember what it means? Try using it in a sentence first.</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  aria-expanded={isOpen}
                  aria-controls={`vocab-${v.word.replace(/\s+/g, "-")}`}
                  onClick={() => setRevealed((r) => ({ ...r, [v.word]: !r[v.word] }))}
                >
                  {isOpen ? "Hide meaning" : "Show meaning"}
                </Button>
                <Button
                  size="sm"
                  variant={isKnown ? "primary" : "ghost"}
                  aria-pressed={!!isKnown}
                  onClick={() => setKnown((k) => ({ ...k, [v.word]: !k[v.word] }))}
                  className={cn(isKnown && "bg-success hover:bg-success")}
                >
                  <Check className="size-3.5" aria-hidden /> {isKnown ? "Known" : "I know it"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PracticeView() {
  const { startConversation } = useApp();
  const [level, setLevel] = useState<Level>(DEMO_STUDENT.level);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice"
        subtitle="Choose a scenario. Replies are scripted for this demo."
        actions={
          <Segmented
            legend="Practice level"
            name="dash-level"
            value={level}
            onChange={setLevel}
            options={LEVELS.map((l) => ({ value: l, label: l }))}
            className="w-64"
          />
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCENARIOS.map((s) => (
          <li key={s.id} className="flex flex-col rounded-2xl border border-line bg-white p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand">
              <ScenarioIcon icon={s.icon} className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold">{s.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate">{s.description}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate">
              <Clock className="size-3.5" aria-hidden /> ~{s.durationMin} min · Recommended {s.recommendedLevel}
            </p>
            <Button className="mt-4" variant="secondary" onClick={() => startConversation(s.id, level)}>
              Start at {level}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VocabularyView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Vocabulary" subtitle="Words and phrases saved from your conversations." />
      <Card>
        <VocabGrid items={VOCAB_REVIEW} />
      </Card>
    </div>
  );
}

function HistoryView({ conversations }: { conversations: RecentConversation[] }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Conversations" subtitle="Your recent practice sessions. Sessions you complete in this demo appear at the top." />
      <Card>
        <ConversationList items={conversations} />
      </Card>
    </div>
  );
}
