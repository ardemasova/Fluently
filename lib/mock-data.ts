/**
 * Synthetic demo data. All names, schools and figures are fictional and
 * exist only to illustrate the product.
 */
import type {
  ActivityEvent,
  Correction,
  DayActivity,
  Insight,
  Level,
  PracticeSession,
  RecentConversation,
  RosterStudent,
  ScenarioId,
  SchoolStats,
  StudentProfile,
  TranscriptLine,
  VocabItem,
} from "@/types";
import { SCENARIO_MAP } from "@/lib/scenarios";

/* ---------------- Student demo ---------------- */

export const DEMO_STUDENT: StudentProfile = {
  firstName: "Lucía",
  fullName: "Lucía Moreno",
  level: "B1",
  targetLevel: "B2",
  weeklyGoalMin: 90,
  minutesThisWeek: 64,
  conversationsCompleted: 23,
  wordsLearned: 148,
  confidence: 68,
  streakDays: 5,
  school: "Northbridge Language School",
  teacher: "Ms. Okafor",
};

export const STUDENT_WEEK: DayActivity[] = [
  { day: "Mon", minutes: 12 },
  { day: "Tue", minutes: 18 },
  { day: "Wed", minutes: 0 },
  { day: "Thu", minutes: 15 },
  { day: "Fri", minutes: 9 },
  { day: "Sat", minutes: 10 },
  { day: "Sun", minutes: 0 },
];

export const STUDENT_INSIGHTS: Insight[] = [
  {
    id: "i1",
    kind: "strength",
    text: "You communicate confidently in familiar situations. Next, try using more varied expressions when explaining your opinions.",
  },
  {
    id: "i2",
    kind: "focus",
    text: "You often use \"since\" with periods of time. Practise \"for three years\" vs \"since 2021\".",
  },
  {
    id: "i3",
    kind: "next",
    text: "Your answers in travel scenarios got longer this week — a good moment to try a job interview at B2.",
  },
];

export const RECENT_CONVERSATIONS: RecentConversation[] = [
  {
    id: "rc1",
    scenarioId: "airport",
    level: "B1",
    dateLabel: "Yesterday",
    minutes: 9,
    takeaway: "Handled the overweight bag politely; practise \"Where's gate B14?\" without \"the\".",
  },
  {
    id: "rc2",
    scenarioId: "small-talk",
    level: "B1",
    dateLabel: "Tue",
    minutes: 7,
    takeaway: "Asked good follow-up questions. New phrase: \"to settle in\".",
  },
  {
    id: "rc3",
    scenarioId: "coffee-shop",
    level: "A2",
    dateLabel: "Mon",
    minutes: 5,
    takeaway: "Swapped \"I want\" for \"Could I get…?\" — much more natural.",
  },
];

export const VOCAB_REVIEW: (VocabItem & { scenarioId: ScenarioId })[] = [
  {
    word: "to settle in",
    definition: "To become comfortable in a new home, job or place.",
    example: "We're still settling in, but we love the neighbourhood.",
    scenarioId: "small-talk",
  },
  {
    word: "layover",
    definition: "A short stop between two flights on the same journey.",
    example: "I have a two-hour layover in Frankfurt.",
    scenarioId: "airport",
  },
  {
    word: "to take ownership of",
    definition: "To accept responsibility for something and make sure it gets done.",
    example: "I took ownership of the onboarding redesign.",
    scenarioId: "job-interview",
  },
  {
    word: "hectic",
    definition: "Very busy, with lots of things happening.",
    example: "It's been a hectic week at work.",
    scenarioId: "small-talk",
  },
];

export const RECOMMENDED_FOR_STUDENT: { scenarioId: ScenarioId; level: Level; reason: string }[] = [
  { scenarioId: "job-interview", level: "B2", reason: "Stretch goal: practise longer answers" },
  { scenarioId: "business-meeting", level: "B1", reason: "Build phrases for giving opinions" },
  { scenarioId: "coffee-shop", level: "B1", reason: "Quick 5-minute warm-up" },
];

/* ---------------- Teacher demo ---------------- */

function transcriptFor(scenarioId: ScenarioId, studentLines: string[]): TranscriptLine[] {
  const s = SCENARIO_MAP[scenarioId];
  const aiLines = [s.opening.text, ...s.turns.map((t) => t.text)];
  const out: TranscriptLine[] = [];
  studentLines.forEach((line, i) => {
    out.push({ role: "ai", text: aiLines[i] });
    out.push({ role: "student", text: line });
  });
  return out;
}

function session(
  id: string,
  scenarioId: ScenarioId,
  level: Level,
  dateLabel: string,
  minutes: number,
  studentLines: string[],
  highlight: string,
  teacherNote: string,
  correction?: Correction,
): PracticeSession {
  return {
    id,
    scenarioId,
    level,
    dateLabel,
    minutes,
    highlight,
    teacherNote,
    transcript: transcriptFor(scenarioId, studentLines),
    correction: correction ?? SCENARIO_MAP[scenarioId].sampleCorrection,
  };
}

export const SCHOOL_STATS: SchoolStats = {
  school: "Northbridge Language School",
  totalStudents: 48,
  activeThisWeek: 31,
  speakingMinutes: 1284,
  avgSessionMin: 8.6,
  weekly: [
    { day: "Mon", minutes: 212 },
    { day: "Tue", minutes: 248 },
    { day: "Wed", minutes: 176 },
    { day: "Thu", minutes: 231 },
    { day: "Fri", minutes: 158 },
    { day: "Sat", minutes: 141 },
    { day: "Sun", minutes: 118 },
  ],
};

export const ROSTER: RosterStudent[] = [
  {
    id: "s1",
    name: "Lucía Moreno",
    level: "B1",
    className: "B1 Evening",
    minutesThisWeek: 64,
    sessionsThisWeek: 7,
    lastActiveLabel: "2 hours ago",
    lastActiveHours: 2,
    confidence: 68,
    confidenceDelta: 6,
    status: "on-track",
    focusArea: "Present perfect with for/since",
    insights: [
      "Confident in travel and everyday scenarios.",
      "Repeatedly uses \"since\" with periods of time.",
      "Ready to try B2 job interview practice.",
    ],
    sessions: [
      session("s1a", "airport", "B1", "Yesterday, 19:20", 9, [
        "Good morning. I'm flying to Dublin. Here is my passport.",
        "I would like to check in one bag, please.",
        "Sure, I can take out my shoes and put them in my backpack.",
      ], "Negotiated the baggage limit politely.", "Great repair strategies. Revisit articles with gate numbers.", {
        original: "Where is the gate B14?",
        suggestion: "Where's gate B14?",
        explanation: "No article before gate or platform numbers.",
      }),
      session("s1b", "small-talk", "B1", "Tue, 21:05", 7, [
        "Hi! Nice to meet you. I am living here since two years.",
        "It's been hectic because I have exams at work.",
      ], "Asked follow-up questions without prompting.", "Target for/since in Thursday's class.", {
        original: "I am living here since two years.",
        suggestion: "I've been living here for two years.",
        explanation: "Present perfect continuous + for with a period of time.",
      }),
    ],
  },
  {
    id: "s2",
    name: "Tomasz Nowak",
    level: "B2",
    className: "B2 Business",
    minutesThisWeek: 112,
    sessionsThisWeek: 9,
    lastActiveLabel: "35 min ago",
    lastActiveHours: 0.6,
    confidence: 81,
    confidenceDelta: 4,
    status: "on-track",
    focusArea: "Diplomatic disagreement",
    insights: [
      "Most active learner this week.",
      "Strong on updates; can soften disagreement more.",
    ],
    sessions: [
      session("s2a", "business-meeting", "B2", "Today, 08:40", 11, [
        "So far we've finished the API integration. The next step is testing with the client.",
        "Honestly, I think two weeks earlier is not possible.",
        "It would help if design could freeze the screens by Monday.",
      ], "Clear status update with next step.", "Model \"I see your point, but…\" for softer disagreement."),
      session("s2b", "job-interview", "B2", "Wed, 18:10", 13, [
        "I'm currently a backend developer and I'm responsible for our payments service.",
        "One project I'm proud of is the migration to a new billing provider.",
      ], "Used STAR structure naturally.", "Excellent — push for more precise results (numbers)."),
    ],
  },
  {
    id: "s3",
    name: "Aiko Tanaka",
    level: "C1",
    className: "IELTS Prep",
    minutesThisWeek: 86,
    sessionsThisWeek: 5,
    lastActiveLabel: "Yesterday",
    lastActiveHours: 22,
    confidence: 77,
    confidenceDelta: 2,
    status: "on-track",
    focusArea: "Part 2 fluency",
    insights: ["Wide vocabulary range.", "Pauses before linking ideas in long turns."],
    sessions: [
      session("s3a", "ielts", "C1", "Yesterday, 20:15", 15, [
        "I'm currently a graduate student researching urban planning.",
        "What I like most is how walkable it is, whereas the new suburbs depend entirely on cars.",
        "Generally speaking, people tend to spend weekends outdoors, especially in spring.",
      ], "Strong contrastive linking.", "Practise filler-free transitions in Part 2."),
    ],
  },
  {
    id: "s4",
    name: "Mateo Rossi",
    level: "A2",
    className: "A2 Morning",
    minutesThisWeek: 8,
    sessionsThisWeek: 1,
    lastActiveLabel: "6 days ago",
    lastActiveHours: 144,
    confidence: 42,
    confidenceDelta: -5,
    status: "needs-attention",
    focusArea: "Polite requests",
    attentionReason: "Practice dropped after a difficult session",
    insights: [
      "Ended last two sessions early.",
      "Short answers — benefits from sentence starters.",
      "Suggest a low-pressure coffee shop scenario.",
    ],
    sessions: [
      session("s4a", "coffee-shop", "A2", "Sat, 11:02", 4, [
        "I want a coffee with milk.",
        "For here.",
      ], "Completed the order.", "Encourage longer answers; praise the attempt.", {
        original: "I want a coffee with milk.",
        suggestion: "Could I get a coffee with milk, please?",
        explanation: "\"Could I get…\" sounds friendlier when ordering.",
      }),
    ],
  },
  {
    id: "s5",
    name: "Fatima Haddad",
    level: "B2",
    className: "B2 Business",
    minutesThisWeek: 54,
    sessionsThisWeek: 4,
    lastActiveLabel: "4 hours ago",
    lastActiveHours: 4,
    confidence: 72,
    confidenceDelta: 3,
    status: "on-track",
    focusArea: "Summarising action points",
    insights: ["Clear structure in meetings.", "Occasionally drops articles."],
    sessions: [
      session("s5a", "business-meeting", "B2", "Today, 06:55", 10, [
        "So far we've completed the user research and the next step is prototype.",
        "I see your point, but I'm worried about quality if we rush.",
      ], "Diplomatic disagreement used well.", "Articles: \"the next step is the prototype\"."),
    ],
  },
  {
    id: "s6",
    name: "Jonas Becker",
    level: "B1",
    className: "B1 Evening",
    minutesThisWeek: 0,
    sessionsThisWeek: 0,
    lastActiveLabel: "12 days ago",
    lastActiveHours: 288,
    confidence: 55,
    confidenceDelta: 0,
    status: "inactive",
    focusArea: "Past simple",
    attentionReason: "No practice in 12 days",
    insights: ["Hasn't practised since onboarding.", "May need a reminder or a shorter first goal."],
    sessions: [
      session("s6a", "small-talk", "B1", "12 days ago", 6, [
        "Hi! I live here since one year.",
        "It was good, I did went to the cinema.",
      ], "Completed first session.", "Follow up personally in class.", {
        original: "I did went to the cinema.",
        suggestion: "I went to the cinema.",
        explanation: "In positive past simple sentences we don't use \"did\".",
      }),
    ],
  },
  {
    id: "s7",
    name: "Priya Sharma",
    level: "C1",
    className: "IELTS Prep",
    minutesThisWeek: 97,
    sessionsThisWeek: 6,
    lastActiveLabel: "1 hour ago",
    lastActiveHours: 1,
    confidence: 84,
    confidenceDelta: 5,
    status: "on-track",
    focusArea: "Idiomatic range",
    insights: ["Very fluent; occasionally over-formal.", "Ready for mock exam."],
    sessions: [
      session("s7a", "ielts", "C1", "Today, 09:30", 14, [
        "I'm a final-year medical student, which means my days are fairly unpredictable.",
        "What I like most is the sense of community — everyone knows the local shop owners.",
      ], "Natural extended answers.", "Try more informal idioms in Part 1."),
    ],
  },
  {
    id: "s8",
    name: "Diego Alvarez",
    level: "A2",
    className: "A2 Morning",
    minutesThisWeek: 31,
    sessionsThisWeek: 4,
    lastActiveLabel: "Yesterday",
    lastActiveHours: 26,
    confidence: 51,
    confidenceDelta: 7,
    status: "on-track",
    focusArea: "Travel vocabulary",
    insights: ["Big confidence jump this week.", "Uses hints well — try without them next."],
    sessions: [
      session("s8a", "airport", "A2", "Yesterday, 17:45", 7, [
        "Good morning. I go to Madrid. Here is my passport.",
        "One bag, please.",
      ], "Completed check-in.", "Model \"I'm flying to…\"."),
    ],
  },
  {
    id: "s9",
    name: "Emma Laurent",
    level: "B2",
    className: "B2 Business",
    minutesThisWeek: 22,
    sessionsThisWeek: 2,
    lastActiveLabel: "3 days ago",
    lastActiveHours: 72,
    confidence: 58,
    confidenceDelta: -3,
    status: "needs-attention",
    focusArea: "Interview answers",
    attentionReason: "Confidence trending down in interview practice",
    insights: ["Answers become shorter under pressure.", "Pre-teach STAR structure."],
    sessions: [
      session("s9a", "job-interview", "B2", "Tue, 19:30", 9, [
        "I am working as marketing assistant since three years.",
        "A project... it was a campaign. It was good.",
      ], "Started strong.", "Short answers in follow-ups — practise STAR.", {
        original: "I am working as marketing assistant since three years.",
        suggestion: "I've been working as a marketing assistant for three years.",
        explanation: "Present perfect continuous + for, and the article \"a\" before a job.",
      }),
    ],
  },
  {
    id: "s10",
    name: "Kwame Mensah",
    level: "B1",
    className: "B1 Evening",
    minutesThisWeek: 45,
    sessionsThisWeek: 5,
    lastActiveLabel: "5 hours ago",
    lastActiveHours: 5,
    confidence: 63,
    confidenceDelta: 2,
    status: "on-track",
    focusArea: "Third-person -s",
    insights: ["Consistent practice pattern.", "Drops third-person -s in fast speech."],
    sessions: [
      session("s10a", "small-talk", "B1", "Today, 07:15", 6, [
        "Hi! I've lived here for four years.",
        "It's been busy. My brother visit me this week.",
      ], "Good conversation flow.", "Third-person -s drill."),
    ],
  },
  {
    id: "s11",
    name: "Sofia Lindqvist",
    level: "C1",
    className: "IELTS Prep",
    minutesThisWeek: 15,
    sessionsThisWeek: 1,
    lastActiveLabel: "5 days ago",
    lastActiveHours: 120,
    confidence: 70,
    confidenceDelta: -2,
    status: "needs-attention",
    focusArea: "Exam timing",
    attentionReason: "Exam in 3 weeks, practice below goal",
    insights: ["Strong accuracy.", "Needs more timed Part 2 practice before the exam."],
    sessions: [
      session("s11a", "ielts", "C1", "Sun, 16:00", 15, [
        "I work as a translator, mostly from Swedish into English.",
      ], "Accurate, natural register.", "Set a 3-session weekly goal."),
    ],
  },
  {
    id: "s12",
    name: "Hana Kim",
    level: "B1",
    className: "B1 Evening",
    minutesThisWeek: 38,
    sessionsThisWeek: 3,
    lastActiveLabel: "Yesterday",
    lastActiveHours: 30,
    confidence: 60,
    confidenceDelta: 1,
    status: "on-track",
    focusArea: "Asking follow-up questions",
    insights: ["Good accuracy, fewer questions back."],
    sessions: [
      session("s12a", "coffee-shop", "B1", "Yesterday, 12:10", 5, [
        "Could I get an iced latte, please?",
        "To go, please. Medium.",
      ], "Natural polite requests.", "Try the C1 version for extra challenge."),
    ],
  },
];

export const ACTIVITY_FEED: ActivityEvent[] = [
  { id: "a1", studentId: "s2", text: "completed Business meeting · B2", timeLabel: "35 min" },
  { id: "a2", studentId: "s7", text: "completed IELTS speaking practice · C1", timeLabel: "1 h" },
  { id: "a3", studentId: "s1", text: "completed Airport and travel · B1", timeLabel: "2 h" },
  { id: "a4", studentId: "s5", text: "learned 6 new words in Business meeting", timeLabel: "4 h" },
  { id: "a5", studentId: "s10", text: "hit a 5-day practice streak", timeLabel: "5 h" },
  { id: "a6", studentId: "s8", text: "completed Airport and travel · A2", timeLabel: "1 d" },
];
