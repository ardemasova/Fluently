import type { RosterStudent, StudentStatus } from "@/types";
import { ROSTER } from "@/lib/mock-data";

export const STATUS_META: Record<StudentStatus, { label: string; tone: "success" | "warn" | "neutral" }> = {
  "on-track": { label: "On track", tone: "success" },
  "needs-attention": { label: "Needs support", tone: "warn" },
  inactive: { label: "Inactive", tone: "neutral" },
};

export function needsAttention(roster: RosterStudent[] = ROSTER): RosterStudent[] {
  return roster.filter((s) => s.status !== "on-track");
}

export function studentById(id: string): RosterStudent | undefined {
  return ROSTER.find((s) => s.id === id);
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
