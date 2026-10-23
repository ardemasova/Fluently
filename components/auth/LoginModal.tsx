"use client";

import { CircleAlert, Globe, GraduationCap, LoaderCircle, Presentation } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { PasswordField, Segmented, TextField } from "@/components/ui/Field";
import { LogoMark } from "@/components/ui/Brand";
import { useApp } from "@/components/providers/AppProvider";

/**
 * Simulated sign-in. By design, NO credentials ever succeed:
 * nothing is sent anywhere, nothing is stored, and the password is cleared
 * after every attempt.
 */
export const LOGIN_ERROR = "Invalid email or password. Please try again.";

type Role = "student" | "teacher";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const identifierRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onClose={onClose} title="Welcome back" hideTitle initialFocus={identifierRef}>
      <LoginForm identifierRef={identifierRef} onClose={onClose} />
    </Dialog>
  );
}

function LoginForm({
  identifierRef,
  onClose,
}: {
  identifierRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
}) {
  const { openModal, showInfo } = useApp();
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Enter your email or username.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);

    if (next.identifier || next.password) {
      setFormError(null);
      (next.identifier ? identifierRef : passwordRef).current?.focus();
      return;
    }

    // Simulated round-trip. The role is intentionally ignored: every attempt fails.
    setSubmitting(true);
    setFormError(null);
    window.setTimeout(() => {
      setSubmitting(false);
      setFormError(LOGIN_ERROR);
      setPassword("");
      passwordRef.current?.focus();
    }, 650);
  }

  function goToDemo(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <div className="px-6 pb-6 pt-8 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <LogoMark className="size-10" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-[15px] text-slate">Sign in to your Fluently account</p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4" aria-describedby={formError ? "login-form-error" : undefined}>
        <Segmented
          legend="I am signing in as"
          name="login-role"
          value={role}
          onChange={setRole}
          options={[
            { value: "student", label: <><GraduationCap className="size-4" aria-hidden /> Student</> },
            { value: "teacher", label: <><Presentation className="size-4" aria-hidden /> Teacher</> },
          ]}
        />

        {formError && (
          <div
            id="login-form-error"
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger-50 px-3.5 py-3 text-sm text-danger"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{formError}</span>
          </div>
        )}

        <TextField
          ref={identifierRef}
          label="Email or username"
          name="identifier"
          autoComplete="username"
          placeholder="you@example.com"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (errors.identifier) setErrors((er) => ({ ...er, identifier: undefined }));
          }}
          error={errors.identifier}
        />
        <PasswordField
          ref={passwordRef}
          label="Password"
          autoComplete="off"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
          }}
          error={errors.password}
          labelAside={
            <button
              type="button"
              className="text-[13px] font-medium text-brand hover:text-brand-700 hover:underline underline-offset-4"
              onClick={() =>
                showInfo({
                  title: "Password recovery is disabled",
                  tone: "lock",
                  body: (
                    <p>
                      Fluently is a portfolio demo, so there are no real accounts to recover. You can explore the student
                      and teacher dashboards without signing in.
                    </p>
                  ),
                })
              }
            >
              Forgot password?
            </button>
          }
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden /> Signing in…
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs font-medium tracking-wider text-slate" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-line" />
        OR
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() =>
          showInfo({
            title: "Google sign-in",
            body: <p>Google sign-in is not available in this demo.</p>,
          })
        }
      >
        <Globe className="size-4.5 text-slate" aria-hidden />
        Continue with Google
      </Button>

      <p className="mt-5 text-center text-sm text-slate">
        New to Fluently?{" "}
        <button
          type="button"
          onClick={() => openModal("register")}
          className="font-medium text-brand hover:text-brand-700 hover:underline underline-offset-4"
        >
          Create an account
        </button>
      </p>

      <div className="mt-5 rounded-xl border border-dashed border-line-strong bg-paper px-4 py-3 text-[13px] leading-relaxed text-slate">
        <span className="font-medium text-ink">Just exploring?</span> Sign-in is simulated and never succeeds. Open the{" "}
        <button type="button" onClick={() => goToDemo("/demo/student")} className="font-medium text-brand underline-offset-4 hover:underline">
          student demo
        </button>{" "}
        or the{" "}
        <button type="button" onClick={() => goToDemo("/demo/teacher")} className="font-medium text-brand underline-offset-4 hover:underline">
          teacher demo
        </button>{" "}
        — no account needed.
      </div>
    </div>
  );
}
