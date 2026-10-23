"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/* Stack of open dialogs so Escape / focus trapping only affect the top one. */
const stack: string[] = [];
let lockCount = 0;
let savedOverflow = "";
let savedPadding = "";

function lockScroll() {
  if (lockCount === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  }
  lockCount++;
}
function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPadding;
  }
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Size = "sm" | "md" | "lg" | "xl" | "panel" | "drawer";

const sizes: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
  xl: "max-w-3xl",
  panel: "max-w-4xl h-[min(760px,calc(100dvh-2rem))] max-sm:h-dvh",
  drawer: "max-w-xl h-dvh ml-auto",
};

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible title. Rendered visually unless `hideTitle`. */
  title: ReactNode;
  description?: ReactNode;
  hideTitle?: boolean;
  size?: Size;
  children: ReactNode;
  initialFocus?: RefObject<HTMLElement | null>;
  closeOnBackdrop?: boolean;
  className?: string;
  /** Use `role="alertdialog"` for short informational notices. */
  alert?: boolean;
  header?: ReactNode;
  icon?: ReactNode;
}

export function Dialog(props: DialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<AnimatePresence>{props.open && <DialogInner {...props} />}</AnimatePresence>, document.body);
}

function DialogInner({
  onClose,
  title,
  description,
  hideTitle,
  size = "md",
  children,
  initialFocus,
  closeOnBackdrop = true,
  className,
  alert,
  header,
  icon,
}: DialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Layout effect so Escape/focus handling is active as soon as the dialog is in the DOM.
  useLayoutEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    stack.push(id);
    lockScroll();

    const focusTarget =
      initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panelRef.current;
    // Wait a frame so the element exists after the enter animation starts.
    const raf = requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (n) => n.offsetParent !== null || n === document.activeElement,
        );
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      const idx = stack.lastIndexOf(id);
      if (idx >= 0) stack.splice(idx, 1);
      unlockScroll();
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPanel = size === "panel";
  const isDrawer = size === "drawer";
  const motionProps = isDrawer
    ? { initial: { opacity: 0.6, x: 48 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 48 } }
    : { initial: { opacity: 0, y: 14, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.98 } };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center",
        isDrawer ? "justify-end" : "justify-center",
        isPanel ? "sm:p-4" : isDrawer ? "" : "p-4",
      )}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={() => closeOnBackdrop && onClose()}
      />
      <motion.div
        ref={panelRef}
        role={alert ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={hideTitle ? undefined : titleId}
        aria-label={hideTitle && typeof title === "string" ? title : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        {...motionProps}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn(
          "relative w-full bg-white shadow-pop outline-none",
          isPanel
            ? "flex flex-col overflow-hidden sm:rounded-2xl sm:border sm:border-line"
            : isDrawer
              ? "overflow-y-auto border-l border-line scrollbar-thin"
              : "max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-line scrollbar-thin",
          sizes[size],
          className,
        )}
      >
        {header}
        {!header && !hideTitle && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pr-14">
            <div>
              {icon && <span className="mb-4 grid size-10 place-items-center rounded-xl bg-brand-50 text-brand">{icon}</span>}
              <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-sm text-slate">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        {header && (
          <span className="sr-only">
            <span id={titleId}>{title}</span>
            {description && <span id={descId}>{description}</span>}
          </span>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3.5 top-3.5 z-10 grid size-9 place-items-center rounded-lg text-slate transition hover:bg-mist hover:text-ink"
        >
          <X className="size-4.5" aria-hidden />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
