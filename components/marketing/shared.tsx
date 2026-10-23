"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em]",
        dark ? "text-lime" : "text-brand",
        className,
      )}
    >
      <span className={cn("h-px w-6", dark ? "bg-lime" : "bg-brand")} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  dark,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  dark?: boolean;
  id?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={cn(
          "mt-4 text-balance text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-5 text-pretty text-lg leading-relaxed", dark ? "text-white/70" : "text-slate", align === "center" && "mx-auto max-w-2xl")}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Serif italic accent used sparingly in headlines. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-display font-normal italic tracking-[-0.01em]", className)}>{children}</span>;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
