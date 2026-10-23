"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ToastTone = "info" | "success" | "warn";

interface ToastItem {
  id: number;
  title: string;
  body?: string;
  tone: ToastTone;
}

interface ToastApi {
  toast: (title: string, opts?: { body?: string; tone?: ToastTone }) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback<ToastApi["toast"]>(
    (title, opts) => {
      const id = nextId++;
      setItems((list) => [...list.slice(-2), { id, title, body: opts?.body, tone: opts?.tone ?? "info" }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white p-3.5 pr-2 shadow-lift"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                  t.tone === "success" && "bg-success-50 text-success",
                  t.tone === "warn" && "bg-warn-50 text-warn",
                  t.tone === "info" && "bg-brand-50 text-brand",
                )}
              >
                {t.tone === "success" ? (
                  <CircleCheck className="size-3.5" aria-hidden />
                ) : t.tone === "warn" ? (
                  <TriangleAlert className="size-3.5" aria-hidden />
                ) : (
                  <Info className="size-3.5" aria-hidden />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{t.title}</p>
                {t.body && <p className="mt-0.5 text-[13px] leading-snug text-slate">{t.body}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="grid size-7 shrink-0 place-items-center rounded-md text-slate hover:bg-mist hover:text-ink"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
