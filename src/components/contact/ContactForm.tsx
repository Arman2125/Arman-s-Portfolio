import { CircleCheck, Loader2, Send, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactForm, contactLinks, profile } from "@/data/resume";
import { contactLimits, sendContactMessage, validateContact, type ContactErrors, type ContactValues } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: ContactValues = { name: "", email: "", message: "" };
const FIELDS = ["name", "email", "message"] as const;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint
      )}
    </div>
  );
}

/**
 * A real contact form: validated in the browser, delivered by FormSubmit to Arman's inbox (see `contactForm`).
 * It does not depend on the visitor having a mail app, which is where plain mailto links fail.
 */
export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [replyTo, setReplyTo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Move focus to the result so keyboard and screen-reader users hear what happened.
  useEffect(() => {
    if (status === "sent") resultRef.current?.focus();
  }, [status]);

  const update = (field: keyof ContactValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    // After the first submit attempt, errors update as the visitor fixes them.
    if (attempted) setErrors(validateContact(next));
    if (status === "error") setStatus("idle");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    // Bots fill hidden fields; pretend it worked and send nothing.
    if (honeypotRef.current?.value) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await sendContactMessage(values, contactForm);
      setReplyTo(values.email.trim());
      setValues(EMPTY);
      setAttempted(false);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="flex animate-in flex-col items-start rounded-xl border bg-background p-6 outline-none duration-500 fade-in-0 slide-in-from-bottom-2 sm:p-8"
      >
        <CircleCheck className="size-8 animate-in text-success duration-500 draw-on-mount zoom-in-50" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-semibold tracking-tight">Message sent. Thank you!</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          It&rsquo;s in my inbox now. I&rsquo;ll reply{replyTo ? ` to ${replyTo}` : ""} as soon as I can.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const sending = status === "sending";
  const messageLength = values.message.trim().length;

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-labelledby="contact-form-title"
      className="relative rounded-xl border bg-background p-5 shadow-card transition-[border-color,box-shadow] duration-500 focus-within:border-brand/40 focus-within:shadow-[0_0_0_4px_var(--brand-muted)] sm:p-7"
    >
      <h3 id="contact-form-title" className="font-semibold tracking-tight">
        Send me a message
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">It goes straight to my inbox. No email app needed.</p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contact-name" label="Name" error={errors.name}>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={update("name")}
              disabled={sending}
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
          </Field>
          <Field id="contact-email" label="Email" error={errors.email}>
            <Input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={update("email")}
              disabled={sending}
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
          </Field>
        </div>

        <Field
          id="contact-message"
          label="Message"
          error={errors.message}
          hint={
            <p id="contact-message-hint" className="text-right font-mono text-xs text-muted-foreground">
              {messageLength}/{contactLimits.message.max}
            </p>
          }
        >
          <Textarea
            id="contact-message"
            name="message"
            rows={5}
            className="min-h-32 resize-y"
            placeholder="A role, a project, or just a question…"
            value={values.message}
            onChange={update("message")}
            disabled={sending}
            required
            maxLength={contactLimits.message.max + 200}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
          />
        </Field>

        {/* honeypot: hidden from people and assistive tech, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this field empty
            <input ref={honeypotRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {status === "error" ? (
          <div role="alert" className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3.5 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <p>
              Your message couldn&rsquo;t be sent right now. Please try again, or email me directly at{" "}
              <a href={contactLinks.email} className="font-medium underline underline-offset-4">
                {profile.email}
              </a>
              .
            </p>
          </div>
        ) : null}

        {/* aria-disabled rather than disabled: a disabled button drops keyboard focus to <body> mid-send */}
        <Button type="submit" size="lg" aria-disabled={sending} className="w-full aria-disabled:opacity-70 sm:w-fit">
          {sending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
          {sending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
