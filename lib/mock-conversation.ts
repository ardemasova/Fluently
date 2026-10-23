import type {
  ChatMessage,
  Correction,
  Feedback,
  Level,
  Scenario,
  SessionSummary,
} from "@/types";

/**
 * Conversation service contract used by the UI.
 * The demo ships a deterministic local implementation; a real LLM-backed
 * service (e.g. a server route that calls a model) can implement the same
 * interface without any UI changes.
 */
export interface ConversationService {
  start(scenario: Scenario, level: Level): ChatMessage;
  reply(input: ReplyInput): Promise<ReplyResult>;
  summarize(input: SummaryInput): SessionSummary;
}

export interface ReplyInput {
  scenario: Scenario;
  level: Level;
  history: ChatMessage[];
  text: string;
}

export interface ReplyResult {
  /** Feedback attached to the student's message just sent. */
  feedback: Feedback[];
  /** The tutor's next message. */
  message: ChatMessage;
  /** True once the scripted conversation has reached its natural end. */
  finished: boolean;
}

export interface SummaryInput {
  scenario: Scenario;
  level: Level;
  history: ChatMessage[];
  startedAt: number;
}

/* ------------------------------------------------------------------ */

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** Small, stable hash so the same input always yields the same variation. */
function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

interface GrammarRule {
  pattern: RegExp;
  fix: (match: string, ...groups: string[]) => string;
  explanation: string;
}

/** A tiny rule set covering frequent learner patterns. Illustrative only. */
const GRAMMAR_RULES: GrammarRule[] = [
  {
    pattern: /\bi am agree\b/i,
    fix: () => "I agree",
    explanation: "\"Agree\" is already a verb — no need for \"am\".",
  },
  {
    pattern: /\bdepends? of\b/i,
    fix: (m) => m.replace(/of$/i, "on"),
    explanation: "We say \"depend on\", not \"depend of\".",
  },
  {
    pattern: /\b(?:i am|i'm) (?:working|living|studying) (?:here |there )?since (\w+) (years|months)\b/i,
    fix: (m, n, unit) => {
      const verb = /working/i.test(m) ? "working" : /living/i.test(m) ? "living" : "studying";
      const place = /here/i.test(m) ? " here" : /there/i.test(m) ? " there" : "";
      return `I've been ${verb}${place} for ${n} ${unit}`;
    },
    explanation: "For an action that started in the past and continues now, use the present perfect continuous with \"for\".",
  },
  {
    pattern: /\bsince (\w+) (years|months|weeks)\b/i,
    fix: (_m, n, unit) => `for ${n} ${unit}`,
    explanation: "Use \"for\" with a period of time and \"since\" with a starting point.",
  },
  {
    pattern: /\bpeople is\b/i,
    fix: () => "people are",
    explanation: "\"People\" is plural, so it takes \"are\".",
  },
  {
    pattern: /\bmore (better|easier|faster|bigger)\b/i,
    fix: (_m, adj) => adj,
    explanation: "Comparatives like \"better\" don't need \"more\".",
  },
  {
    pattern: /\bexplain me\b/i,
    fix: () => "explain to me",
    explanation: "We explain something to someone.",
  },
  {
    pattern: /\bi have (\d+) years\b/i,
    fix: (_m, n) => `I'm ${n} years old`,
    explanation: "In English, we use \"be\" for age.",
  },
  {
    pattern: /\bin the weekend\b/i,
    fix: () => "at the weekend",
    explanation: "Use \"at the weekend\" (UK) or \"on the weekend\" (US).",
  },
  {
    pattern: /\bmake a (photo|picture|picnic|party)\b/i,
    fix: (_m, n) => `${n === "photo" || n === "picture" ? "take" : "have"} a ${n}`,
    explanation: "This is a collocation — the verb is fixed by the noun.",
  },
  {
    pattern: /\b(he|she|it) (go|have|do|want|work|like)\b/i,
    fix: (_m, s, v) => `${s} ${v === "have" ? "has" : v === "go" ? "goes" : v === "do" ? "does" : `${v}s`}`,
    explanation: "Third-person singular verbs take an -s in the present simple.",
  },
  {
    pattern: /\bdid (went|saw|made|took|came)\b/i,
    fix: (_m, v) => `did ${({ went: "go", saw: "see", made: "make", took: "take", came: "come" } as Record<string, string>)[v.toLowerCase()]}`,
    explanation: "After \"did\", use the base form of the verb.",
  },
];

interface NaturalRule {
  pattern: RegExp;
  suggestion: string;
  detail: string;
}

/** Phrases that are correct but could sound more natural in context. */
const NATURAL_RULES: NaturalRule[] = [
  {
    pattern: /^i want (a|an|the|to)\b/i,
    suggestion: "I'd like… / Could I get…?",
    detail: "\"I'd like\" or \"Could I get…?\" sounds more polite than \"I want\".",
  },
  {
    pattern: /\bi work as (a |an )?designer and i make websites\b/i,
    suggestion: "I'm a designer, and I build websites for different companies.",
    detail: "\"Build\" is the more natural verb for websites.",
  },
  {
    pattern: /\bvery very\b/i,
    suggestion: "really / extremely",
    detail: "Try a single, stronger intensifier instead of repeating \"very\".",
  },
  {
    pattern: /\bi think that yes\b/i,
    suggestion: "I think so.",
    detail: "In English we say \"I think so\" to agree.",
  },
];

const ENCOURAGEMENT = [
  "Clear and easy to follow.",
  "Good, confident answer.",
  "Nice — that sounds natural.",
  "Well structured.",
];

const ACKS_BY_LEVEL: Record<Level, string[]> = {
  A2: ["Great!", "OK, good.", "Nice.", "Thank you!"],
  B1: ["Got it.", "That makes sense.", "Nice, thanks.", "Sounds good."],
  B2: ["That's really helpful.", "Right, I see.", "Interesting.", "Fair enough."],
  C1: ["That's a thoughtful answer.", "Interesting perspective.", "Understood.", "That's well put."],
};

function analyse(text: string, scenario: Scenario): Feedback[] {
  const feedback: Feedback[] = [];

  for (const rule of GRAMMAR_RULES) {
    const match = text.match(rule.pattern);
    if (match) {
      const fixed = rule.fix(match[0], ...match.slice(1));
      feedback.push({
        kind: "grammar",
        label: "Grammar tip",
        detail: rule.explanation,
        suggestion: `"${match[0]}" → "${fixed}"`,
      });
      break;
    }
  }

  for (const rule of NATURAL_RULES) {
    if (rule.pattern.test(text)) {
      feedback.push({ kind: "natural", label: "Natural expression", detail: rule.detail, suggestion: rule.suggestion });
      break;
    }
  }

  const lower = text.toLowerCase();
  const usedVocab = scenario.vocabulary.find((v) => lower.includes(v.word.toLowerCase()));
  if (usedVocab) {
    feedback.push({ kind: "vocabulary", label: "Great vocabulary", detail: `You used "${usedVocab.word}" naturally.` });
  }

  const words = wordCount(text);
  if (feedback.length === 0 && words <= 3) {
    feedback.push({
      kind: "vocabulary",
      label: "Try expanding",
      detail: "Short answers are fine, but adding a reason or detail helps you practise more.",
    });
  } else if (feedback.length === 0) {
    feedback.push({
      kind: "encouragement",
      label: words >= 18 ? "Great fluency" : "Great phrasing",
      detail: ENCOURAGEMENT[hash(text) % ENCOURAGEMENT.length],
    });
  }

  return feedback;
}

function pickReaction(text: string, scenario: Scenario): string | undefined {
  const lower = text.toLowerCase();
  return scenario.reactions.find((r) => r.keywords.some((k) => lower.includes(k)))?.reply;
}

function decorate(turnText: string, level: Level, stretch?: string): string {
  if (level === "C1" && stretch) return `${turnText} ${stretch}`;
  return turnText;
}

const WRAP_UP = [
  "We've covered the main parts of this scenario — nice work. You can keep chatting, or end the session to see your review.",
  "That's a natural place to finish. End the session whenever you're ready to see your demo review.",
];

const FOLLOW_UPS = [
  "Could you tell me a bit more about that?",
  "Interesting — why do you say that?",
  "How would you phrase that in a more formal situation?",
];

export const mockConversationService: ConversationService = {
  start(scenario, level) {
    const showHint = level === "A2" || level === "B1";
    return {
      id: uid("ai"),
      role: "ai",
      text: decorate(scenario.opening.text, level, scenario.opening.stretch),
      hint: showHint ? scenario.opening.hint : undefined,
      createdAt: Date.now(),
    };
  },

  async reply({ scenario, level, history, text }) {
    const feedback = analyse(text, scenario);
    // Number of AI messages already sent (opening included) indicates the next scripted turn.
    const aiCount = history.filter((m) => m.role === "ai").length;
    const turnIndex = aiCount - 1;
    const showHint = level === "A2" || level === "B1";

    const ack = pickReaction(text, scenario) ?? ACKS_BY_LEVEL[level][hash(text) % 4];

    let body: string;
    let hint: string | undefined;
    let finished = false;

    if (turnIndex < scenario.turns.length) {
      const turn = scenario.turns[turnIndex];
      body = decorate(turn.text, level, turn.stretch);
      hint = showHint ? turn.hint : undefined;
      finished = turnIndex === scenario.turns.length - 1;
    } else {
      const extra = turnIndex - scenario.turns.length;
      body = extra % 2 === 0 ? FOLLOW_UPS[hash(text) % FOLLOW_UPS.length] : WRAP_UP[hash(text) % WRAP_UP.length];
      finished = true;
    }

    // Simulated "thinking" latency, scaled a little by message length.
    await new Promise((r) => setTimeout(r, 650 + Math.min(900, body.length * 6)));

    return {
      feedback,
      finished,
      message: { id: uid("ai"), role: "ai", text: `${ack} ${body}`, hint, createdAt: Date.now() },
    };
  },

  summarize({ scenario, level, history, startedAt }) {
    const studentMessages = history.filter((m) => m.role === "student");
    let correction: Correction = scenario.sampleCorrection;
    let fromSession = false;

    for (const msg of studentMessages) {
      const tip = msg.feedback?.find((f) => f.kind === "grammar" || f.kind === "natural");
      if (tip?.suggestion) {
        correction = {
          original: msg.text,
          suggestion: tip.suggestion.replace(/^"(.*)" → "(.*)"$/, "$2"),
          explanation: tip.detail,
        };
        fromSession = true;
        break;
      }
    }

    // Two vocabulary items the student didn't use yet.
    const allText = studentMessages.map((m) => m.text.toLowerCase()).join(" ");
    const unused = scenario.vocabulary.filter((v) => !allText.includes(v.word.toLowerCase()));
    const vocabulary = (unused.length >= 2 ? unused : scenario.vocabulary).slice(0, 2);

    return {
      scenarioId: scenario.id,
      level,
      practiced: scenario.skills,
      correction,
      correctionFromSession: fromSession,
      vocabulary,
      nextScenarioId: scenario.nextScenarioId,
      studentTurns: studentMessages.length,
      studentWords: studentMessages.reduce((n, m) => n + wordCount(m.text), 0),
      minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
    };
  },
};

export function createStudentMessage(text: string): ChatMessage {
  return { id: uid("me"), role: "student", text, createdAt: Date.now() };
}
