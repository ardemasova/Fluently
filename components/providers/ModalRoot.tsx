"use client";

import { Info, Lock } from "lucide-react";
import { useRef } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { OnboardingDialog } from "@/components/dialogs/OnboardingDialog";
import { UpgradeDialog } from "@/components/dialogs/UpgradeDialog";
import { ContactDialog } from "@/components/dialogs/ContactDialog";
import { ConversationPanel } from "@/components/chat/ConversationPanel";

/** Renders every global dialog. Lives once inside AppProvider. */
export function ModalRoot() {
  const { modal, closeModal, info, closeInfo, conversation, closeConversation } = useApp();

  // Keep the last content around so exit animations don't render empty panels.
  const lastInfo = useRef(info);
  if (info) lastInfo.current = info;
  const lastConversation = useRef(conversation);
  if (conversation) lastConversation.current = conversation;
  const shownInfo = lastInfo.current;

  return (
    <>
      <LoginModal open={modal === "login"} onClose={closeModal} />
      <RegisterModal open={modal === "register"} onClose={closeModal} />
      <OnboardingDialog open={modal === "onboarding"} onClose={closeModal} />
      <UpgradeDialog open={modal === "upgrade"} onClose={closeModal} />
      <ContactDialog open={modal === "contact"} onClose={closeModal} />

      {lastConversation.current && (
        <ConversationPanel
          key={lastConversation.current.key}
          open={conversation !== null}
          scenarioId={lastConversation.current.scenarioId}
          level={lastConversation.current.level}
          onClose={closeConversation}
        />
      )}

      {/* Informational notices stack above any other dialog. */}
      <Dialog
        open={info !== null}
        onClose={closeInfo}
        title={shownInfo?.title ?? ""}
        size="sm"
        alert
        icon={shownInfo?.tone === "lock" ? <Lock className="size-5" aria-hidden /> : <Info className="size-5" aria-hidden />}
      >
        {shownInfo && (
          <div className="px-6 pb-6">
            <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-slate">{shownInfo.body}</div>
            <Button data-autofocus className="mt-6 w-full" variant="dark" onClick={closeInfo}>
              Got it
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
}
