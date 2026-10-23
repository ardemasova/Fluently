import { BookOpen, Clock, FileText, Gauge, MessagesSquare, PenLine, Sparkles, Theater } from "lucide-react";
import { Waveform } from "@/components/ui/Brand";
import { TutorAvatar } from "@/components/chat/MessageBubble";
import { Accent, Reveal, SectionHeading } from "@/components/marketing/shared";

const FEATURES = [
  { icon: Clock, title: "Practice anytime", body: "Morning commute or late evening — your partner is always ready." },
  { icon: Theater, title: "Real-life roleplay", body: "Interviews, check-ins, meetings and more, with a tutor in character." },
  { icon: PenLine, title: "Personalized corrections", body: "Specific, gentle feedback on what you actually said." },
  { icon: BookOpen, title: "Vocabulary suggestions", body: "Useful phrases for the situation, saved for later review." },
  { icon: FileText, title: "Conversation summaries", body: "A clear review after every session — what went well, what's next." },
  { icon: Gauge, title: "Adaptive difficulty", body: "From A2 sentence starters to C1 follow-up challenges." },
];

export function VoiceShowcase() {
  return (
    <section id="students" aria-labelledby="students-title" className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-32">
        <div>
          <Reveal>
            <SectionHeading
              dark
              id="students-title"
              eyebrow="For students"
              title={
                <>
                  A speaking partner that <Accent className="text-lime">meets you</Accent> where you are.
                </>
              }
              lead="Fluently listens, responds in character and helps you notice what to improve — without the pressure of an audience."
            />
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={i * 0.04}>
                  <f.icon className="size-5 text-lime" aria-hidden />
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-white/65">{f.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <figure className="relative rounded-3xl bg-white p-2 text-ink shadow-pop" aria-label="Example conversation with feedback">
            <div className="rounded-[20px] border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessagesSquare className="size-4 text-brand" aria-hidden /> Networking event · B1
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-slate ring-1 ring-line">Example</span>
              </div>

              <div className="space-y-5 px-5 py-6">
                <div className="flex items-end gap-2.5">
                  <TutorAvatar />
                  <div>
                    <p className="text-xs text-slate">AI tutor</p>
                    <p className="mt-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-[15px] leading-relaxed">
                      Imagine we&apos;re meeting for the first time at a networking event. What do you do?
                    </p>
                  </div>
                </div>

                <div className="ml-auto max-w-[86%] text-right">
                  <p className="text-xs text-slate">Student</p>
                  <p className="mt-1 rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-left text-[15px] leading-relaxed text-white">
                    I work as a designer and I make websites for different companies.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate">
                    <Sparkles className="size-3.5 text-brand" aria-hidden /> AI tutor feedback
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed">
                    Nice! A more natural version would be:{" "}
                    <span className="rounded bg-lime-soft px-1 font-medium">
                      &ldquo;I&apos;m a designer, and I build websites for different companies.&rdquo;
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      <Sparkles className="size-3" aria-hidden /> Natural expression
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-warn-50 px-2 py-0.5 text-xs font-medium text-warn">
                      <PenLine className="size-3" aria-hidden /> Grammar tip
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-soft px-2 py-0.5 text-xs font-medium text-lime-ink">
                      <BookOpen className="size-3" aria-hidden /> New vocabulary
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-line px-5 py-4 text-brand">
                <span className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand" />
                  <span className="relative size-2.5 rounded-full bg-brand" />
                </span>
                <span className="text-xs font-medium text-slate">AI tutor is listening</span>
                <Waveform bars={40} className="h-8 flex-1" />
              </div>
            </div>
            <figcaption className="px-3 pb-1.5 pt-2.5 text-xs text-slate">Illustrative example. Voice input shown as a product concept.</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
