"use client";

import { useApp } from "@/components/providers/AppProvider";

/** Openers for the informational Privacy and Terms dialogs. */
export function useLegal() {
  const { showInfo } = useApp();
  return {
    privacy: () =>
      showInfo({
        title: "Privacy (demo)",
        body: (
          <>
            <p>Fluently is a frontend portfolio demo. There are no accounts, and nothing you type is sent to a server.</p>
            <p>
              Login and registration fields are never stored or transmitted. The only thing saved in your browser is a
              short list of demo practice sessions you complete, so the student dashboard can show them.
            </p>
          </>
        ),
      }),
    terms: () =>
      showInfo({
        title: "Terms (demo)",
        body: (
          <>
            <p>This site demonstrates product design and frontend engineering. It is not a commercial service.</p>
            <p>
              All names, schools, figures, pricing and feedback are illustrative. Conversation replies are scripted and are
              not produced by a real AI model or assessment engine.
            </p>
          </>
        ),
      }),
  };
}
