"use client";

import { ArrowRight } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Waveform } from "@/components/ui/Brand";
import { useApp } from "@/components/providers/AppProvider";
import { Accent, Reveal } from "@/components/marketing/shared";

export function FinalCta() {
  const { openModal } = useApp();
  return (
    <section aria-labelledby="cta-title" className="px-5 pb-24 sm:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-brand px-6 py-20 text-center text-white sm:px-12 lg:py-28">
          <Waveform bars={64} className="pointer-events-none absolute inset-x-0 bottom-0 h-40 justify-center gap-[6px] text-white/10" barClassName="w-[5px]" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your next conversation <Accent className="text-lime">starts here.</Accent>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
              Build the confidence to speak English in the moments that matter.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="lime" onClick={() => openModal("onboarding")}>
                Start practicing <ArrowRight className="size-4" aria-hidden />
              </Button>
              <LinkButton href="/demo/student" size="lg" className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15" variant="ghost">
                Explore the student demo
              </LinkButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
