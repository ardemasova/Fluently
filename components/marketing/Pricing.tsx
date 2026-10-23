"use client";

import { Check } from "lucide-react";
import { PLANS, type Plan } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/components/providers/AppProvider";
import { Reveal, SectionHeading } from "@/components/marketing/shared";
import { cn } from "@/lib/cn";

export function Pricing() {
  const { openModal } = useApp();
  const action: Record<Plan["id"], () => void> = {
    free: () => openModal("onboarding"),
    plus: () => openModal("upgrade"),
    schools: () => openModal("contact"),
  };

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <SectionHeading
          id="pricing-title"
          align="center"
          eyebrow="Pricing"
          title="Simple plans for learners and schools"
          lead={
            <>
              Start free, upgrade when you&apos;re practising every week.{" "}
              <span className="font-medium text-ink">Demo pricing — no payments are taken.</span>
            </>
          }
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <article
              className={cn(
                "flex h-full flex-col rounded-3xl p-7 sm:p-8",
                p.featured ? "bg-ink text-white shadow-pop" : "border border-line bg-white",
              )}
              aria-labelledby={`plan-${p.id}`}
            >
              <div className="flex items-center justify-between">
                <h3 id={`plan-${p.id}`} className="text-lg font-semibold">
                  {p.name}
                </h3>
                {p.featured && <Badge tone="lime">Most popular</Badge>}
              </div>
              <p className={cn("mt-1.5 text-sm", p.featured ? "text-white/70" : "text-slate")}>{p.blurb}</p>
              <p className="mt-7 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-[-0.04em]">{p.price}</span>
                {p.period && <span className={p.featured ? "text-white/70" : "text-slate"}>{p.period}</span>}
              </p>
              <ul className="mt-7 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[15px]">
                    <Check className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-lime" : "text-brand")} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                variant={p.featured ? "lime" : p.id === "schools" ? "dark" : "secondary"}
                className="mt-8 w-full"
                onClick={action[p.id]}
              >
                {p.cta}
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate">Illustrative prices for a portfolio demo. Fluently is not a commercial service.</p>
    </section>
  );
}
