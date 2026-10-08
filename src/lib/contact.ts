export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const contactLimits = {
  name: { min: 2, max: 80 },
  message: { min: 10, max: 2000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns one message per invalid field; an empty object means the form can be sent. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length < contactLimits.name.min) errors.name = "Your name looks too short.";
  else if (name.length > contactLimits.name.max) errors.name = `Please keep your name under ${contactLimits.name.max} characters.`;

  if (!email) errors.email = "Please enter your email so I can reply.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "That email address doesn't look right.";

  if (!message) errors.message = "Please write a message.";
  else if (message.length < contactLimits.message.min)
    errors.message = `Please write at least ${contactLimits.message.min} characters.`;
  else if (message.length > contactLimits.message.max)
    errors.message = `Please keep it under ${contactLimits.message.max} characters.`;

  return errors;
}

export class ContactSendError extends Error {}

interface SendOptions {
  endpoint: string;
  subject: string;
  /** Honeypot value: real visitors leave it empty, bots tend to fill it. */
  honeypot?: string;
  timeoutMs?: number;
}

/**
 * Sends the message through FormSubmit's AJAX endpoint.
 * FormSubmit answers 200 with `{ success: "true" | "false", message }`, so both the HTTP status and the body are checked.
 */
export async function sendContactMessage(values: ContactValues, options: SendOptions): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  try {
    const response = await fetch(options.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        _subject: options.subject,
        _template: "table",
        _honey: options.honeypot ?? "",
      }),
      signal: controller.signal,
    });

    const body: { success?: boolean | string; message?: string } = await response.json().catch(() => ({}));
    const ok = response.ok && (body.success === true || body.success === "true");
    if (!ok) throw new ContactSendError(body.message || `The form service answered with HTTP ${response.status}.`);
  } catch (error) {
    if (error instanceof ContactSendError) throw error;
    throw new ContactSendError(controller.signal.aborted ? "The request timed out." : "Network error.");
  } finally {
    clearTimeout(timer);
  }
}
