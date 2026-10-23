"use client";

import { Info } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { PasswordField, SelectField, TextField } from "@/components/ui/Field";
import { useApp } from "@/components/providers/AppProvider";
import { isEmail } from "@/lib/validation";

export const REGISTER_DISABLED = "Registration is disabled in this demo.";

export function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create your account"
      description="Start practising with Fluently — this form is a demo and creates nothing."
      initialFocus={nameRef}
    >
      <RegisterForm nameRef={nameRef} />
    </Dialog>
  );
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

function RegisterForm({ nameRef }: { nameRef: React.RefObject<HTMLInputElement | null> }) {
  const { openModal } = useApp();
  const [values, setValues] = useState({ name: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!isEmail(values.email)) next.email = "Enter a valid email address, like name@example.com.";
    if (!values.password) next.password = "Create a password.";
    else if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (!values.role) next.role = "Choose how you'll use Fluently.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      setNotice(false);
      const firstKey = (["name", "email", "password", "role"] as const).find((k) => next[k]);
      document.getElementById(`register-${firstKey}`)?.focus();
      return;
    }
    // Nothing is created or persisted. The password is discarded immediately.
    setValues((v) => ({ ...v, password: "" }));
    setNotice(true);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-5">
      {notice && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-brand/20 bg-brand-50 px-3.5 py-3 text-sm text-brand-700">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <strong className="font-semibold">{REGISTER_DISABLED}</strong> Try the{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => openModal("onboarding")}>
              guided demo
            </button>{" "}
            instead.
          </span>
        </div>
      )}
      <TextField ref={nameRef} id="register-name" label="Full name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />
      <TextField id="register-email" label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      <PasswordField
        id="register-password"
        label="Password"
        autoComplete="off"
        value={values.password}
        onChange={set("password")}
        error={errors.password}
        hint="At least 8 characters."
      />
      <SelectField id="register-role" label="I'm joining as" value={values.role} onChange={set("role")} error={errors.role}>
        <option value="">Select a role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">School administrator</option>
      </SelectField>
      <Button type="submit" size="lg" className="w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-slate">
        Already have an account?{" "}
        <button type="button" onClick={() => openModal("login")} className="font-medium text-brand hover:underline underline-offset-4">
          Log in
        </button>
      </p>
    </form>
  );
}
