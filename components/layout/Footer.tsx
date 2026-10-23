"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { Wordmark } from "@/components/ui/Brand";
import { useApp } from "@/components/providers/AppProvider";
import { useLegal } from "@/components/layout/legal";

const linkClass = "text-[15px] text-white/70 transition hover:text-white";

export function Footer() {
  const { openModal } = useApp();
  const legal = useLegal();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Wordmark inverted />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/65">
              An AI speaking partner that keeps language learning going between lessons.
            </p>
          </div>

          <FooterCol title="Product">
            <Link href="/#how-it-works" className={linkClass}>How it works</Link>
            <Link href="/#practice" className={linkClass}>Practice scenarios</Link>
            <Link href="/#pricing" className={linkClass}>Pricing</Link>
          </FooterCol>
          <FooterCol title="For students">
            <Link href="/#students" className={linkClass}>Features</Link>
            <Link href="/demo/student" className={linkClass}>Student demo</Link>
            <button type="button" onClick={() => openModal("onboarding")} className={`${linkClass} text-left`}>Get started</button>
          </FooterCol>
          <FooterCol title="For schools">
            <Link href="/#schools" className={linkClass}>Overview</Link>
            <Link href="/demo/teacher" className={linkClass}>Teacher demo</Link>
            <button type="button" onClick={() => openModal("contact")} className={`${linkClass} text-left`}>Contact sales</button>
          </FooterCol>
          <FooterCol title="Legal">
            <button type="button" onClick={legal.privacy} className={`${linkClass} text-left`}>Privacy</button>
            <button type="button" onClick={legal.terms} className={`${linkClass} text-left`}>Terms</button>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
            Fluently is a portfolio demonstration, not a real commercial service. All data, names and pricing are illustrative.
          </p>
          <p>© {new Date().getFullYear()} Fluently demo</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <div className="mt-4 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}
