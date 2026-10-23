"use client";

import { Activity, ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Clock, LayoutDashboard, Search, TriangleAlert, Users, UserRoundCheck, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell, Card, PageHeader } from "@/components/layout/DashboardShell";
import { Avatar } from "@/components/ui/Brand";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WeeklyBars } from "@/components/ui/Charts";
import { useToast } from "@/components/ui/Toast";
import { StudentDetailPanel } from "@/components/teacher/StudentDetailPanel";
import { ACTIVITY_FEED, ROSTER, SCHOOL_STATS } from "@/lib/mock-data";
import { STATUS_META, formatMinutes, needsAttention, studentById } from "@/lib/teacher";
import { getScenario } from "@/lib/scenarios";
import { LEVELS, type Level, type RosterStudent, type StudentStatus } from "@/types";
import { cn } from "@/lib/cn";

type View = "overview" | "students" | "activity";
type SortKey = "name" | "level" | "minutesThisWeek" | "lastActiveHours" | "confidence";
type SortDir = "asc" | "desc";

const attention = needsAttention();

const NAV: { id: View; label: string; icon: LucideIcon; count?: number }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users, count: attention.length },
  { id: "activity", label: "Activity", icon: Activity },
];

export function TeacherDashboard() {
  const [view, setView] = useState<View>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? studentById(selectedId) ?? null : null;

  return (
    <DashboardShell
      nav={NAV}
      active={view}
      onNavigate={setView}
      user={{ name: "Grace Okafor", meta: "Teacher · Northbridge (demo)" }}
      switchTo={{ href: "/demo/student", label: "Switch to student demo" }}
    >
      {view === "overview" && <Overview onOpen={setSelectedId} onNavigate={setView} />}
      {view === "students" && (
        <div className="space-y-6">
          <PageHeader title="Students" subtitle="Search, filter and sort your roster. Select a student to see their details." />
          <Roster onOpen={setSelectedId} />
        </div>
      )}
      {view === "activity" && <ActivityView onOpen={setSelectedId} />}
      <StudentDetailPanel student={selected} onClose={() => setSelectedId(null)} />
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */

function Overview({ onOpen, onNavigate }: { onOpen: (id: string) => void; onNavigate: (v: View) => void }) {
  const { toast } = useToast();
  const st = SCHOOL_STATS;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Grace"
        subtitle={`${st.school} · week of practice at a glance`}
        actions={
          <Button
            variant="secondary"
            onClick={() => toast("Export is disabled in the demo", { body: "In a real deployment this would download a CSV report." })}
          >
            Export report
          </Button>
        }
      />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} label="Total students" value={st.totalStudents} sub="Across 4 classes" />
        <Stat icon={UserRoundCheck} label="Active this week" value={st.activeThisWeek} sub={`${Math.round((st.activeThisWeek / st.totalStudents) * 100)}% of students`} />
        <Stat icon={Clock} label="Speaking minutes" value={st.speakingMinutes.toLocaleString("en-GB")} sub={`Avg. session ${st.avgSessionMin} min`} />
        <Stat icon={TriangleAlert} label="May need support" value={attention.length} sub="Based on activity & trends" warn />
      </dl>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Speaking minutes this week" action={<DemoBadge label="Demo data" />}>
          <WeeklyBars data={st.weekly} className="mt-6" caption="Total speaking minutes across the school each day this week" barClassName="bg-ink" height="h-40" />
        </Card>
        <Card title="Students who need attention">
          <ul className="space-y-1">
            {attention.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onOpen(s.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-paper"
                >
                  <Avatar name={s.name} tone="mist" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{s.name}</span>
                    <span className="block truncate text-xs text-slate">{s.attentionReason}</span>
                  </span>
                  <Badge tone={STATUS_META[s.status].tone}>{STATUS_META[s.status].label}</Badge>
                  <ChevronRight className="size-4 text-slate" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card
          title="Recent activity"
          action={
            <button type="button" onClick={() => onNavigate("activity")} className="text-sm font-medium text-brand hover:underline underline-offset-4">
              View all
            </button>
          }
        >
          <ActivityList onOpen={onOpen} limit={5} />
        </Card>
        <Card title="Recent practice sessions">
          <RecentSessions onOpen={onOpen} />
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-semibold tracking-tight">Student progress</h2>
        <Roster onOpen={onOpen} />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, warn }: { icon: LucideIcon; label: string; value: string | number; sub: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <dt className="flex items-center gap-1.5 text-sm text-slate">
        <Icon className={cn("size-4", warn && "text-warn")} aria-hidden /> {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</dd>
      <dd className="mt-0.5 text-xs text-slate">{sub}</dd>
    </div>
  );
}

function ActivityList({ onOpen, limit }: { onOpen: (id: string) => void; limit?: number }) {
  const items = limit ? ACTIVITY_FEED.slice(0, limit) : ACTIVITY_FEED;
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-line">
      {items.map((a) => {
        const s = studentById(a.studentId)!;
        return (
          <li key={a.id} className="relative flex items-start gap-3">
            <Avatar name={s.name} className="relative size-9 ring-4 ring-white" />
            <p className="min-w-0 flex-1 pt-1.5 text-sm">
              <button type="button" onClick={() => onOpen(s.id)} className="font-medium hover:text-brand hover:underline underline-offset-4">
                {s.name}
              </button>{" "}
              <span className="text-slate">{a.text}</span>
            </p>
            <span className="pt-1.5 text-xs text-slate tabular-nums">{a.timeLabel}</span>
          </li>
        );
      })}
    </ol>
  );
}

function RecentSessions({ onOpen }: { onOpen: (id: string) => void }) {
  const rows = [...ROSTER]
    .filter((s) => s.sessions.length > 0)
    .sort((a, b) => a.lastActiveHours - b.lastActiveHours)
    .slice(0, 5);
  return (
    <ul className="divide-y divide-line">
      {rows.map((s) => {
        const ses = s.sessions[0];
        return (
          <li key={ses.id}>
            <button type="button" onClick={() => onOpen(s.id)} className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-paper/70">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {s.name} <span className="font-normal text-slate">· {getScenario(ses.scenarioId).title}</span>
                </span>
                <span className="block truncate text-xs text-slate">{ses.highlight}</span>
              </span>
              <span className="text-xs text-slate tabular-nums">{ses.minutes} min</span>
              <Badge>{ses.level}</Badge>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ActivityView({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity" subtitle="What your students have been practising recently." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Activity feed">
          <ActivityList onOpen={onOpen} />
        </Card>
        <Card title="Latest sessions">
          <RecentSessions onOpen={onOpen} />
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Roster table ---------------- */

const LEVEL_ORDER: Record<Level, number> = { A2: 0, B1: 1, B2: 2, C1: 3 };

function Roster({ onOpen }: { onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level | "all">("all");
  const [status, setStatus] = useState<StudentStatus | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "lastActiveHours", dir: "asc" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = ROSTER.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q)) &&
        (level === "all" || s.level === level) &&
        (status === "all" || s.status === status),
    );
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const k = sort.key;
      const av = k === "level" ? LEVEL_ORDER[a.level] : a[k];
      const bv = k === "level" ? LEVEL_ORDER[b.level] : b[k];
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * factor;
      return ((av as number) - (bv as number)) * factor;
    });
  }, [query, level, status, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" || key === "lastActiveHours" ? "asc" : "desc" }));
  }

  const filtersActive = query !== "" || level !== "all" || status !== "all";

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <label htmlFor="roster-search" className="sr-only">Search students by name</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate" aria-hidden />
          <input
            id="roster-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students by name…"
            className="h-10 w-full rounded-xl border border-line bg-paper pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <fieldset className="flex items-center gap-1 rounded-xl border border-line bg-paper p-1">
            <legend className="sr-only">Filter by level</legend>
            {(["all", ...LEVELS] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={cn(
                  "h-8 rounded-lg px-2.5 text-[13px] font-medium transition",
                  level === l ? "bg-white text-ink shadow-soft" : "text-slate hover:text-ink",
                )}
              >
                {l === "all" ? "All levels" : l}
              </button>
            ))}
          </fieldset>
          <label htmlFor="roster-status" className="sr-only">Filter by status</label>
          <select
            id="roster-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StudentStatus | "all")}
            className="h-10 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
          >
            <option value="all">All statuses</option>
            <option value="on-track">On track</option>
            <option value="needs-attention">Needs support</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{rows.length} students shown</p>

      {rows.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="font-medium">No students match your filters</p>
          <p className="mt-1 text-sm text-slate">Try a different name or level.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setLevel("all");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Student roster with level, weekly practice, last activity, confidence and status. Column headers with buttons are sortable.</caption>
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wider text-slate">
              <tr>
                <SortHeader label="Student" k="name" sort={sort} onSort={toggleSort} />
                <SortHeader label="Level" k="level" sort={sort} onSort={toggleSort} />
                <SortHeader label="Practice this week" k="minutesThisWeek" sort={sort} onSort={toggleSort} />
                <SortHeader label="Last activity" k="lastActiveHours" sort={sort} onSort={toggleSort} />
                <SortHeader label="Confidence" k="confidence" sort={sort} onSort={toggleSort} />
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((s) => (
                <RosterRow key={s.id} s={s} onOpen={onOpen} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-slate">
        <span>
          Showing {rows.length} of {ROSTER.length} students{filtersActive && " (filtered)"}
        </span>
        <span>Sample roster · synthetic data</span>
      </div>
    </div>
  );
}

function RosterRow({ s, onOpen }: { s: RosterStudent; onOpen: (id: string) => void }) {
  const meta = STATUS_META[s.status];
  return (
    <tr className="group cursor-pointer transition hover:bg-paper/70" onClick={() => onOpen(s.id)}>
      <td className="px-4 py-3">
        <span className="flex items-center gap-3">
          <Avatar name={s.name} className="size-8 text-xs" />
          <span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(s.id);
              }}
              className="font-medium hover:text-brand"
            >
              {s.name}
            </button>
            <span className="block text-xs text-slate">{s.className}</span>
          </span>
        </span>
      </td>
      <td className="px-4 py-3"><Badge tone="brand">{s.level}</Badge></td>
      <td className="px-4 py-3 tabular-nums">
        {formatMinutes(s.minutesThisWeek)}
        <span className="block text-xs text-slate">{s.sessionsThisWeek} {s.sessionsThisWeek === 1 ? "session" : "sessions"}</span>
      </td>
      <td className="px-4 py-3 text-slate">{s.lastActiveLabel}</td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-2 tabular-nums">
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-mist" aria-hidden>
            <span className="block h-full rounded-full bg-brand" style={{ width: `${s.confidence}%` }} />
          </span>
          {s.confidence}
          <span className={cn("text-xs", s.confidenceDelta > 0 ? "text-success" : s.confidenceDelta < 0 ? "text-danger" : "text-slate")}>
            {s.confidenceDelta > 0 ? `+${s.confidenceDelta}` : s.confidenceDelta}
          </span>
        </span>
      </td>
      <td className="px-4 py-3"><Badge tone={meta.tone}>{meta.label}</Badge></td>
      <td className="px-4 py-3 text-right">
        <ChevronRight className="ml-auto size-4 text-slate transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
      </td>
    </tr>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSort: (k: SortKey) => void;
}) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th scope="col" aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className="px-4 py-2 font-medium">
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn("-ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 uppercase tracking-wider hover:bg-mist hover:text-ink", active && "text-ink")}
      >
        {label}
        <Icon className="size-3.5" aria-hidden />
      </button>
    </th>
  );
}
