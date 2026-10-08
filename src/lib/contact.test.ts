import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactSendError, sendContactMessage, validateContact } from "./contact";

const valid = { name: "Priya Recruiter", email: "priya@example.com", message: "Hi Arman, are you open to a full-stack role?" };
const options = { endpoint: "https://formsubmit.co/ajax/test@example.com", subject: "Test" };

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every empty field", () => {
    expect(Object.keys(validateContact({ name: " ", email: "", message: "" })).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects malformed emails", () => {
    for (const email of ["arman", "arman@", "arman@gmail", "a b@gmail.com"]) {
      expect(validateContact({ ...valid, email }).email, email).toBeDefined();
    }
  });

  it("enforces message length", () => {
    expect(validateContact({ ...valid, message: "short" }).message).toBeDefined();
    expect(validateContact({ ...valid, message: "x".repeat(2001) }).message).toBeDefined();
  });
});

describe("sendContactMessage", () => {
  afterEach(() => vi.unstubAllGlobals());

  const respond = (status: number, body: unknown) =>
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));

  it("posts trimmed JSON with the FormSubmit fields", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: "true" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await sendContactMessage({ ...valid, name: `  ${valid.name}  ` }, options);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(options.endpoint);
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({ name: valid.name, email: valid.email, _subject: "Test", _honey: "" });
  });

  it("treats FormSubmit's success:false (e.g. form not activated yet) as a failure", async () => {
    respond(200, { success: "false", message: "This form needs Activation." });
    await expect(sendContactMessage(valid, options)).rejects.toThrow("This form needs Activation.");
  });

  it("fails on HTTP errors", async () => {
    respond(500, {});
    await expect(sendContactMessage(valid, options)).rejects.toBeInstanceOf(ContactSendError);
  });

  it("fails cleanly when the network is down", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))));
    await expect(sendContactMessage(valid, options)).rejects.toThrow("Network error.");
  });
});
