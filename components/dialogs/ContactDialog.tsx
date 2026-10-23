"use client";

import { CircleCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { isEmail } from "@/lib/validation";

export function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Fluently for Schools"
      description="Tell us about your school and we'll tailor a demo. (This form doesn't send anything.)"
      size="lg"
      initialFocus={firstRef}
    >
      <ContactForm firstRef={firstRef} onClose={onClose} />
    </Dialog>
  );
}

type Key = "name" | "email" | "school" | "size" | "message";

function ContactForm({ firstRef, onClose }: { firstRef: React.RefObject<HTMLInputElement | null>; onClose: () => void }) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<Key, string>>({ name: "", email: "", school: "", size: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Key, string>> = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) next.email = "Enter your work email.";
    else if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (!values.school.trim()) next.school = "Enter your school or organisation.";
    if (!values.size) next.size = "Select the number of students.";
    if (values.message.length > 500) next.message = "Keep your message under 500 characters.";
    setErrors(next);
    const first = (["name", "email", "school", "size", "message"] as const).find((k) => next[k]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setSent(true);
    toast("Request received (demo)", { body: "Nothing was sent — this form is a demo.", tone: "success" });
  }

  if (sent) {
    return (
      <div className="px-6 pb-6 pt-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-success-50 text-success">
          <CircleCheck className="size-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold">Thanks, {values.name.split(" ")[0]}!</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate">
          In a real deployment our team would get back to you about {values.school}. Because Fluently is a portfolio demo,
          your details weren&apos;t sent or stored anywhere.
        </p>
        <Button data-autofocus variant="dark" className="mt-6" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
      <TextField ref={firstRef} id="contact-name" label="Your name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />
      <TextField id="contact-email" label="Work email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      <TextField id="contact-school" label="School or organisation" value={values.school} onChange={set("school")} error={errors.school} />
      <SelectField id="contact-size" label="Number of students" value={values.size} onChange={set("size")} error={errors.size}>
        <option value="">Select a range</option>
        <option>Fewer than 50</option>
        <option>50–200</option>
        <option>200–1,000</option>
        <option>More than 1,000</option>
      </SelectField>
      <div className="sm:col-span-2">
        <TextAreaField
          id="contact-message"
          label="What would you like to achieve? (optional)"
          rows={3}
          value={values.message}
          onChange={set("message")}
          error={errors.message}
        />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Request a demo</Button>
      </div>
    </form>
  );
}
