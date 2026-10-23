import { ArrowRight, Eye, Sparkles, TriangleAlert, Users } from "lucide-react";
import { ROSTER, SCHOOL_STATS } from "@/lib/mock-data";
import { STATUS_META, formatMinutes, needsAttention } from "@/lib/teacher";
import { getScenario } from "@/lib/scenarios";
import { Avatar } from "@/components/ui/Brand";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Accent, Reveal, SectionHeading } from "@/components/marketing/shared";

const BENEFITS = [
  { icon: Users, title: "Students practise outside the classroom", body: "Assign scenarios that match your syllabus. Students practise when it suits them." },
  { icon: Eye, title: "Visibility into speaking progress", body: "See who's practising, for how long and where they're getting stuck." },
  { icon: Sparkles, title: "More personalised lessons", body: "Use conversation insights to plan the next class around real needs." },
];

export function TeacherSection() {
  const attention = needsAttention();
  const preview = ROSTER.slice(0, 5);
  const recent = ROSTER.flatMap((s) => s.sessions.slice(0, 1).map((ses) => ({ s, ses }))).slice(0, 3);

  return (
    <section id="schools" aria-labelledby="schools-title" className="border-y border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <SectionHeading
              id="schools-title"
              eyebrow="For language schools"
              title={
                <>
                  Give every student <Accent>more time</Accent> to speak.
                </>
              }
              lead="Fluently extends your classes into the week. Students get a speaking partner between lessons; teachers get the insight to make every lesson count."
            />
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <li key={b.title}>
                <Reveal delay={i * 0.05}>
                  <span className="grid size-10 place-items-center rounded-xl bg-lime text-ink">
                    <b.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold leading-snug">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{b.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-lift" aria-label="Teacher dashboard preview">
            {/* window bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                </span>
                <p className="text-sm font-medium">Teacher dashboard · {SCHOOL_STATS.school}</p>
              </div>
              <DemoBadge label="Demo · sample data" />
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_300px]">
              <div className="min-w-0 space-y-4">
                <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    ["Total students", SCHOOL_STATS.totalStudents],
                    ["Active this week", SCHOOL_STATS.activeThisWeek],
                    ["Speaking minutes", SCHOOL_STATS.speakingMinutes.toLocaleString("en-GB")],
                    ["Need support", attention.length],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-2xl border border-line bg-white p-4">
                      <dt className="text-xs text-slate">{l}</dt>
                      <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="relative overflow-x-auto rounded-2xl border border-line bg-white">
                  <table className="w-full min-w-[540px] text-left text-sm">
                    <caption className="sr-only">Sample of students with level, practice time and last activity</caption>
                    <thead className="border-b border-line text-xs uppercase tracking-wider text-slate">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Student</th>
                        <th scope="col" className="px-4 py-3 font-medium">Level</th>
                        <th scope="col" className="px-4 py-3 font-medium">Practice this week</th>
                        <th scope="col" className="px-4 py-3 font-medium">Last activity</th>
                        <th scope="col" className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {preview.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-2.5 font-medium">
                              <Avatar name={s.name} className="size-7 text-[11px]" />
                              {s.name}
                            </span>
                          </td>
                          <td className="px-4 py-3"><Badge tone="brand">{s.level}</Badge></td>
                          <td className="px-4 py-3 tabular-nums">{formatMinutes(s.minutesThisWeek)}</td>
                          <td className="px-4 py-3 text-slate">{s.lastActiveLabel}</td>
                          <td className="px-4 py-3"><Badge tone={STATUS_META[s.status].tone}>{STATUS_META[s.status].label}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <TriangleAlert className="size-4 text-warn" aria-hidden /> May need additional support
                  </p>
                  <ul className="mt-3 space-y-3">
                    {attention.slice(0, 3).map((s) => (
                      <li key={s.id} className="flex items-start gap-2.5">
                        <Avatar name={s.name} tone="mist" className="size-7 text-[11px]" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-slate">{s.attentionReason}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-sm font-medium">Recent practice sessions</p>
                  <ul className="mt-3 space-y-2.5">
                    {recent.map(({ s, ses }) => (
                      <li key={ses.id} className="text-sm">
                        <span className="font-medium">{s.name.split(" ")[0]}</span>{" "}
                        <span className="text-slate">
                          · {getScenario(ses.scenarioId).title} · {ses.minutes} min
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <LinkButton href="/demo/teacher" variant="dark" size="lg">
            Explore the teacher dashboard <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
          <p className="text-sm text-slate">Fully interactive demo — search, filter and open student reviews.</p>
        </div>
      </div>
    </section>
  );
}
