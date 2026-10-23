"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CompletedSession, Level, ScenarioId } from "@/types";
import { ToastProvider } from "@/components/ui/Toast";
import { ModalRoot } from "@/components/providers/ModalRoot";

export type ModalName = "login" | "register" | "onboarding" | "upgrade" | "contact";

export interface InfoContent {
  title: string;
  body: ReactNode;
  tone?: "info" | "lock";
}

interface ConversationRequest {
  scenarioId: ScenarioId;
  level: Level;
  /** Changes on every request so the panel restarts cleanly. */
  key: number;
}

interface AppState {
  modal: ModalName | null;
  openModal: (name: ModalName) => void;
  closeModal: () => void;
  info: InfoContent | null;
  showInfo: (content: InfoContent) => void;
  closeInfo: () => void;
  conversation: ConversationRequest | null;
  startConversation: (scenarioId: ScenarioId, level: Level) => void;
  closeConversation: () => void;
  completedSessions: CompletedSession[];
  recordSession: (s: CompletedSession) => void;
}

const AppContext = createContext<AppState | null>(null);

/** Non-sensitive demo state only (completed practice sessions). Never auth data. */
const SESSIONS_KEY = "fluently-demo:completed-sessions";

export function AppProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalName | null>(null);
  const [info, setInfo] = useState<InfoContent | null>(null);
  const [conversation, setConversation] = useState<ConversationRequest | null>(null);
  const [completedSessions, setCompleted] = useState<CompletedSession[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      if (raw) setCompleted(JSON.parse(raw) as CompletedSession[]);
    } catch {
      /* storage unavailable — demo still works in memory */
    }
  }, []);

  const recordSession = useCallback((s: CompletedSession) => {
    setCompleted((prev) => {
      const next = [s, ...prev].slice(0, 8);
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const startConversation = useCallback((scenarioId: ScenarioId, level: Level) => {
    setModal(null);
    setConversation({ scenarioId, level, key: Date.now() });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      modal,
      openModal: setModal,
      closeModal: () => setModal(null),
      info,
      showInfo: setInfo,
      closeInfo: () => setInfo(null),
      conversation,
      startConversation,
      closeConversation: () => setConversation(null),
      completedSessions,
      recordSession,
    }),
    [modal, info, conversation, startConversation, completedSessions, recordSession],
  );

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AppContext.Provider value={value}>
          {children}
          <ModalRoot />
        </AppContext.Provider>
      </ToastProvider>
    </MotionConfig>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
