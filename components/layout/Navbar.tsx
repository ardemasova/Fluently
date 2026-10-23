"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/cn";

export const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#students", label: "For students" },
  { href: "#schools", label: "For schools" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const { openModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200",
        scrolled || menuOpen ? "border-b border-line bg-paper/95 backdrop-blur-sm" : "border-b border-transparent bg-paper",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-[68px] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Fluently home" className="rounded-lg">
          <Wordmark />
        </Link>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3.5 py-2 text-[15px] text-ink-2 transition hover:bg-ink/5 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 lg:ml-0 lg:flex">
          <Button variant="ghost" onClick={() => openModal("login")}>
            Log in
          </Button>
          <Button variant="dark" onClick={() => openModal("onboarding")}>
            Get started
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => openModal("login")}>
            Log in
          </Button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-lg text-ink hover:bg-ink/5"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <ul className="space-y-1 px-5 py-4 sm:px-8">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-ink/5"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-2 pt-3">
                <Button variant="secondary" onClick={() => { setMenuOpen(false); openModal("login"); }}>
                  Log in
                </Button>
                <Button variant="dark" onClick={() => { setMenuOpen(false); openModal("onboarding"); }}>
                  Get started
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
