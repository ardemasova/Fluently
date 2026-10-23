"use client";

import { Flag, Lightbulb, Mic, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ChatMessage, Level, ScenarioId, SessionSummary as Summary } from "@/types";
import { getScenario } from "@/lib/scenarios";
import { createStudentMessage, mockConversationService as service } from "@/lib/mock-conversation";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { ScenarioIcon, Waveform } from "@/components/ui/Brand";
import { useApp } from "@/components/providers/AppProvider";
import { useToast } from "@/components/ui/Toast";
import { MessageBubble, TypingIndicator } from "@/components/chat/MessageBubble";
import { SessionSummary } from "@/components/chat/SessionSummary";

interface Props {
  open: boolean;
  scenarioId: ScenarioId;
  level: Level;
  onClose: () => void;
}

export function ConversationPanel({ open, scenarioId, level, onClose }: Props) {
  const scenario = getScenario(scenarioId);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${scenario.title} practice conversation`}
      size="panel"
      initialFocus={inputRef}
      closeOnBackdrop={false}
      header={<span />}
    >
      <Conversation scenarioId={scenarioId} level={level} onClose={onClose} inputRef={inputRef} />
    </Dialog>
  );
}

function Conversation({
  scenarioId,
  level,
  onClose,
  inputRef,
}: Omit<Props, "open"> & { inputRef: React.RefObject<HTMLTextAreaElement | null> }) {
  const scenario = getScenario(scenarioId);
  const { startConversation, recordSession } = useApp();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [service.start(scenario, level)]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [finished, setFinished] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [startedAt] = useState(() => Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const lastAi = [...messages].reverse().find((m) => m.role === "ai");

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || typing) return;
    const studentMsg = createStudentMessage(clean);
    const history = [...messages, studentMsg];
    setMessages(history);
    setDraft("");
    setTyping(true);
    const result = await service.reply({ scenario, level, history, text: clean });
    if (!alive.current) return;
    setMessages((prev) => [
      ...prev.map((m) => (m.id === studentMsg.id ? { ...m, feedback: result.feedback } : m)),
      result.message,
    ]);
    setTyping(false);
    if (result.finished) setFinished(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(draft);
    }
  }

  function endSession() {
    const s = service.summarize({ scenario, level, history: messages, startedAt });
    setSummary(s);
    if (s.studentTurns > 0) {
      recordSession({
        id: `cs-${Date.now()}`,
        scenarioId: scenario.id,
        level,
        endedAt: Date.now(),
        studentTurns: s.studentTurns,
        minutes: s.minutes,
      });
      toast("Session saved", { body: "Added to recent conversations in the student demo.", tone: "success" });
    }
  }

  // auto-grow textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [draft, inputRef]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line bg-white py-3 pl-4 pr-14 sm:pl-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
          <ScenarioIcon icon={scenario.icon} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="truncate font-semibold tracking-tight">{scenario.title}</h2>
            <Badge tone="brand">{level}</Badge>
            <DemoBadge label="Demo conversation" className="max-sm:hidden" />
          </div>
          <p className="truncate text-[13px] text-slate">AI tutor role: {scenario.role}</p>
        </div>
        {!summary && (
          <Button variant="secondary" size="sm" onClick={endSession} className="shrink-0">
            <Flag className="size-3.5" aria-hidden /> <span className="max-sm:sr-only">End session</span>
          </Button>
        )}
      </div>

      {summary ? (
        <SessionSummary
          summary={summary}
          onClose={onClose}
          onRestart={() => startConversation(scenario.id, level)}
          onNext={() => startConversation(summary.nextScenarioId, level)}
        />
      ) : (
        <>
          {/* Transcript */}
          <div ref={scrollRef} className="dot-grid flex-1 overflow-y-auto bg-paper px-4 py-5 scrollbar-thin sm:px-6">
            <p className="mx-auto mb-5 max-w-md rounded-full border border-line bg-white/80 px-3 py-1.5 text-center text-xs text-slate">
              <span className="sm:hidden">Demo conversation · </span>Replies are scripted locally — no AI model is connected.
            </p>
            <div className="mx-auto flex max-w-2xl flex-col gap-4" aria-live="polite" aria-relevant="additions">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {typing && <TypingIndicator />}
            </div>
            {finished && !typing && (
              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-brand-50 px-4 py-3">
                <p className="text-sm text-brand-700">You&apos;ve completed this scenario. Ready for your review?</p>
                <Button size="sm" onClick={endSession}>
                  See session review
                </Button>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-line bg-white px-3 pb-3 pt-2.5 sm:px-5 sm:pb-4">
            {voiceNotice && (
              <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5" role="status">
                <Waveform bars={14} active={false} className="h-6 text-slate/50" />
                <p className="flex-1 text-[13px] leading-snug text-slate">
                  <span className="font-medium text-ink">Voice mode is a preview.</span> Speech recognition isn&apos;t
                  connected in this demo — type your reply instead.
                </p>
                <button
                  type="button"
                  onClick={() => setVoiceNotice(false)}
                  aria-label="Dismiss voice preview notice"
                  className="grid size-7 place-items-center rounded-md text-slate hover:bg-mist"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            )}
            {lastAi?.hint && !typing && (
              <button
                type="button"
                onClick={() => {
                  const starter = lastAi.hint!.split(" / ")[0];
                  setDraft(starter.includes("…") ? `${starter.split("…")[0].trimEnd()} ` : starter);
                  inputRef.current?.focus();
                }}
                className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[13px] text-ink-2 transition hover:border-brand/40 hover:bg-brand-50"
              >
                <Lightbulb className="size-3.5 shrink-0 text-warn" aria-hidden />
                <span className="truncate">
                  <span className="text-slate">Sentence starter:</span> {lastAi.hint}
                </span>
              </button>
            )}
            <form onSubmit={onSubmit} className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setVoiceNotice((v) => !v)}
                aria-pressed={voiceNotice}
                aria-label="Voice mode (preview — not available in this demo)"
                title="Voice mode preview"
                className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-slate transition hover:text-ink"
              >
                <Mic className="size-4.5" aria-hidden />
                <span className="absolute -right-1 -top-1 rounded-full bg-mist px-1 text-[9px] font-semibold uppercase tracking-wide text-slate ring-2 ring-white">
                  Preview
                </span>
              </button>
              <label htmlFor="chat-input" className="sr-only">
                Your reply
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your reply in English…"
                maxLength={600}
                className="min-h-11 flex-1 resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] leading-6 outline-none transition placeholder:text-slate/70 focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <Button type="submit" className="size-11 shrink-0 px-0!" disabled={!draft.trim() || typing} aria-label="Send message">
                <Send className="size-4" aria-hidden />
              </Button>
            </form>
            <p className="mt-1.5 hidden text-[11.5px] text-slate sm:block">Enter to send · Shift + Enter for a new line</p>
          </div>
        </>
      )}
    </>
  );
}
