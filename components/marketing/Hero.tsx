"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Check, Mic, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Waveform } from "@/components/ui/Brand";
import { TutorAvatar } from "@/components/chat/MessageBubble";
import { Accent, scrollToId } from "@/components/marketing/shared";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-[13px] text-ink-2 shadow-soft"
          >
            <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">New</span>
            Speaking practice for language schools
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-7 text-[3.4rem] font-semibold leading-[0.95] tracking-[-0.05em] text-ink sm:text-7xl lg:text-[5.6rem]"
          >
            Speak more.
            <br />
            <span className="relative inline-block">
              <Accent className="text-brand">Worry less.</Accent>
              <svg viewBox="0 0 300 16" className="absolute -bottom-2 left-0 h-3 w-full text-lime" preserveAspectRatio="none" aria-hidden>
                <path d="M2 11C60 4 140 2 298 7" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-slate sm:text-xl"
          >
            Your personal AI speaking partner, available whenever you&apos;re ready to talk. Practice real conversations,
            build confidence, and make every lesson count.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" onClick={() => scrollToId("practice")}>
              Try your AI tutor <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToId("how-it-works")}>
              See how it works
            </Button>
          </motion.div>

          <p className="mt-7 flex items-center gap-2 text-sm text-slate">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-lime">
              <Check className="size-3" aria-hidden />
            </span>
            Built to complement your language classes, not replace your teacher.
          </p>
        </div>

        <HeroPreview />
      </div>

      <div className="border-y border-line bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-4 text-sm text-slate sm:px-8">
          <span className="font-medium text-ink">Practice for the moments that matter</span>
          {["Job interviews", "Travel", "Small talk", "Business meetings", "IELTS speaking", "Ordering & everyday"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-line-strong" aria-hidden />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative mx-auto w-full max-w-[520px] lg:mr-0"
      role="img"
      aria-label="Preview of a Fluently practice session: a job interview conversation at B2 level with live feedback."
    >
      {/* back plate */}
      <div className="absolute -inset-x-4 -bottom-6 top-10 -z-10 rotate-[-2deg] rounded-[28px] bg-brand" aria-hidden />

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-pop" aria-hidden>
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand">
              <Briefcase className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Job interview · B2 English</p>
              <p className="text-xs text-slate">Hiring manager · Product company</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 font-mono text-xs text-ink-2">
            <span className="size-1.5 rounded-full bg-success" /> 04:12
          </span>
        </div>

        {/* transcript */}
        <div className="space-y-4 bg-paper px-5 py-5">
          <div className="flex items-end gap-2.5">
            <TutorAvatar />
            <p className="max-w-[80%] rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-2.5 text-[14px] leading-relaxed">
              Tell me about a project you&apos;re particularly proud of.
            </p>
          </div>
          <div className="ml-auto max-w-[82%]">
            <p className="rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[14px] leading-relaxed text-white">
              Last year I lead the redesign of our booking app, and we reduce the support tickets a lot.
            </p>
            <div className="mt-2 flex flex-wrap justify-end gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[11.5px] font-medium text-success">
                <Sparkles className="size-3" /> Great phrasing
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warn-50 px-2 py-0.5 text-[11.5px] font-medium text-warn">
                <PenLine className="size-3" /> Try the past tense here
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px]">
            <p className="text-slate">
              <span className="font-medium text-ink">led</span> · <span className="font-medium text-ink">reduced</span> — both
              actions finished last year.
            </p>
          </div>
        </div>

        {/* voice bar */}
        <div className="flex items-center gap-4 border-t border-line px-5 py-4">
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/40" />
            <Mic className="relative size-4.5" />
          </span>
          <Waveform bars={34} className="h-9 flex-1 text-brand" />
          <span className="text-xs text-slate">Your turn</span>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -left-3 bottom-24 hidden rotate-[-3deg] rounded-xl border border-line bg-white px-3 py-2 shadow-lift sm:block lg:-left-10" aria-hidden>
        <p className="text-[11px] uppercase tracking-wider text-slate">New vocabulary</p>
        <p className="text-sm font-semibold">to take ownership of</p>
      </div>
      <div className="absolute -right-2 -top-4 hidden rotate-[3deg] rounded-xl bg-lime px-3 py-2 text-ink shadow-lift sm:block" aria-hidden>
        <p className="text-sm font-semibold">Natural expression ✓</p>
      </div>
    </motion.div>
  );
}
