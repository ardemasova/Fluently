"use client";

import { ArrowLeft, ArrowLeftRight, Menu, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/ui/Brand";
import { Avatar } from "@/components/ui/Brand";
import { DemoBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export interface NavItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
  count?: number;
}

export function DashboardShell<T extends string>({
  nav,
  active,
  onNavigate,
  user,
  switchTo,
  children,
}: {
  nav: NavItem<T>[];
  active: T;
  onNavigate: (id: T) => void;
  user: { name: string; meta: string };
  switchTo: { href: string; label: string };
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const navList = (
    <ul className="space-y-1">
      {nav.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
                window.scrollTo({ top: 0 });
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition",
                isActive ? "bg-white text-ink shadow-soft ring-1 ring-line" : "text-slate hover:bg-ink/5 hover:text-ink",
              )}
            >
              <item.icon className={cn("size-4.5", isActive && "text-brand")} aria-hidden />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span className="rounded-full bg-warn-50 px-2 text-xs font-semibold text-warn tabular-nums">{item.count}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-3">
      <Link
        href={switchTo.href}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate transition hover:bg-ink/5 hover:text-ink"
      >
        <ArrowLeftRight className="size-4" aria-hidden /> {switchTo.label}
      </Link>
      <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate transition hover:bg-ink/5 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Back to website
      </Link>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
        <Avatar name={user.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-slate">{user.meta}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-paper-2/60 px-4 py-5 lg:flex">
        <Link href="/" aria-label="Fluently home" className="px-2">
          <Wordmark />
        </Link>
        <DemoBadge className="mx-2 mt-4 self-start" />
        <nav aria-label="Dashboard" className="mt-7 flex-1">
          {navList}
        </nav>
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="Fluently home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <DemoBadge label="Demo" />
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="dash-mobile-nav"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-lg hover:bg-ink/5"
            >
              {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav id="dash-mobile-nav" aria-label="Dashboard" className="space-y-4 border-t border-line px-4 py-4 sm:px-6">
            {navList}
            {footer}
          </nav>
        )}
      </div>

      <main id="main" className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-slate">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-2xl border border-line bg-white p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-semibold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
