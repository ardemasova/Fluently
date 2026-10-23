"use client";

import { Check, Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { PLUS_FEATURES } from "@/lib/pricing";

export function UpgradeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Upgrade to Plus" description="More practice, deeper feedback. Demo pricing — no payment is taken." size="md">
      <UpgradeBody onClose={onClose} />
    </Dialog>
  );
}

function UpgradeBody({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [attempted, setAttempted] = useState(false);
  const price = billing === "monthly" ? "€12" : "€9.60";

  return (
    <div className="px-6 pb-6 pt-5">
      <Segmented
        legend="Billing period"
        name="billing"
        value={billing}
        onChange={setBilling}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: <>Yearly <Badge tone="lime" className="py-0! text-[11px]">−20%</Badge></> },
        ]}
      />
      <div className="mt-4 rounded-2xl bg-ink p-5 text-white">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Sparkles className="size-4 text-lime" aria-hidden /> Fluently Plus
        </div>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight tabular-nums">{price}</span>
          <span className="text-white/70">/ month{billing === "yearly" && ", billed yearly"}</span>
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {PLUS_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="size-4 text-lime" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </div>
      {attempted && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-3.5 py-3 text-sm text-brand-700">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          Payments are disabled in this demo. Nothing was charged and no card details were requested.
        </p>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          data-autofocus
          className="sm:flex-1"
          onClick={() => {
            setAttempted(true);
            toast("Demo upgrade", { body: "Payments are disabled — this is a portfolio demo." });
          }}
        >
          Start Plus (demo)
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Maybe later
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-slate">Illustrative pricing for demonstration only.</p>
    </div>
  );
}
