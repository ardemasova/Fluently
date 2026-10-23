export type Level = "A2" | "B1" | "B2" | "C1";

export const LEVELS: readonly Level[] = ["A2", "B1", "B2", "C1"] as const;

export type ScenarioId =
  | "coffee-shop"
  | "job-interview"
  | "airport"
  | "small-talk"
  | "business-meeting"
  | "ielts";

export type IconKey =
  | "coffee"
  | "briefcase"
  | "plane"
  | "chat"
  | "presentation"
  | "graduation";

export interface VocabItem {
  word: string;
  definition: string;
  example: string;
}

export interface Correction {
  original: string;
  suggestion: string;
  explanation: string;
}

/** One scripted tutor turn. `hint` is a sentence starter shown at A2/B1, `stretch` an extra challenge at C1. */
export interface ScriptTurn {
  text: string;
  hint?: string;
  stretch?: string;
}

/** Keyword-triggered acknowledgement that precedes the next scripted turn. */
export interface Reaction {
  keywords: string[];
  reply: string;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  icon: IconKey;
  durationMin: number;
  recommendedLevel: Level;
  category: string;
  role: string;
  skills: string[];
  vocabulary: VocabItem[];
  nextScenarioId: ScenarioId;
  opening: ScriptTurn;
  turns: ScriptTurn[];
  reactions: Reaction[];
  sampleCorrection: Correction;
}

export type FeedbackKind = "natural" | "grammar" | "vocabulary" | "encouragement";

export interface Feedback {
  kind: FeedbackKind;
  label: string;
  detail: string;
  suggestion?: string;
}

export type Speaker = "ai" | "student";

export interface ChatMessage {
  id: string;
  role: Speaker;
  text: string;
  hint?: string;
  feedback?: Feedback[];
  createdAt: number;
}

export interface SessionSummary {
  scenarioId: ScenarioId;
  level: Level;
  practiced: string[];
  correction: Correction;
  correctionFromSession: boolean;
  vocabulary: VocabItem[];
  nextScenarioId: ScenarioId;
  studentTurns: number;
  studentWords: number;
  minutes: number;
}

export interface CompletedSession {
  id: string;
  scenarioId: ScenarioId;
  level: Level;
  endedAt: number;
  studentTurns: number;
  minutes: number;
}

/* ---------- Student dashboard ---------- */

export interface StudentProfile {
  firstName: string;
  fullName: string;
  level: Level;
  targetLevel: Level;
  weeklyGoalMin: number;
  minutesThisWeek: number;
  conversationsCompleted: number;
  wordsLearned: number;
  confidence: number;
  streakDays: number;
  school: string;
  teacher: string;
}

export interface DayActivity {
  day: string;
  minutes: number;
}

export interface Insight {
  id: string;
  kind: "strength" | "focus" | "next";
  text: string;
}

export interface RecentConversation {
  id: string;
  scenarioId: ScenarioId;
  level: Level;
  dateLabel: string;
  minutes: number;
  takeaway: string;
}

/* ---------- Teacher dashboard ---------- */

export type StudentStatus = "on-track" | "needs-attention" | "inactive";

export interface TranscriptLine {
  role: Speaker;
  text: string;
}

export interface PracticeSession {
  id: string;
  scenarioId: ScenarioId;
  level: Level;
  dateLabel: string;
  minutes: number;
  highlight: string;
  transcript: TranscriptLine[];
  correction: Correction;
  teacherNote: string;
}

export interface RosterStudent {
  id: string;
  name: string;
  level: Level;
  className: string;
  minutesThisWeek: number;
  sessionsThisWeek: number;
  lastActiveLabel: string;
  lastActiveHours: number;
  confidence: number;
  confidenceDelta: number;
  status: StudentStatus;
  focusArea: string;
  attentionReason?: string;
  insights: string[];
  sessions: PracticeSession[];
}

export interface ActivityEvent {
  id: string;
  studentId: string;
  text: string;
  timeLabel: string;
}

export interface SchoolStats {
  school: string;
  totalStudents: number;
  activeThisWeek: number;
  speakingMinutes: number;
  avgSessionMin: number;
  weekly: DayActivity[];
}
