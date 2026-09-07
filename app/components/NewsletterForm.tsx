"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLang } from "./LangProvider";

type SubmitState = "idle" | "submitting" | "success" | "error";

const STORAGE_KEY = "rucfc-newsletter-subscribers";
const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/* Without a configured endpoint the address is kept in localStorage so the
   form still behaves honestly in a preview build -- see NEWSLETTER_BACKEND.md. */
function saveLocalSubscriber(email: string) {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  let existing: Array<{ email: string; createdAt: string }> = [];

  try {
    existing = raw ? (JSON.parse(raw) as Array<{ email: string; createdAt: string }>) : [];
  } catch {
    existing = [];
  }

  if (!existing.some((item) => item.email === email)) {
    existing.push({ email, createdAt: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export default function NewsletterForm() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [messageKey, setMessageKey] = useState("");

  const buttonLabel = useMemo(() => {
    if (state === "submitting") return t("newsletter.submitting");
    if (state === "success") return t("newsletter.subscribed");
    return t("newsletter.subscribe");
  }, [state, t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!isValidEmail(normalized)) {
      setState("error");
      setMessageKey("newsletter.invalid");
      return;
    }

    setState("submitting");
    setMessageKey("newsletter.submittingMessage");

    try {
      if (NEWSLETTER_ENDPOINT) {
        const response = await fetch(NEWSLETTER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            email: normalized,
            list: "RUCFC Newsletter",
            language: lang,
            source: "rucfc-website",
            page: window.location.href,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error("Newsletter endpoint rejected the request.");
      } else {
        saveLocalSubscriber(normalized);
      }

      setEmail("");
      setState("success");
      setMessageKey("newsletter.success");
    } catch {
      setState("error");
      setMessageKey("newsletter.error");
    }
  };

  return (
    <form className="newsletter" onSubmit={handleSubmit} noValidate>
      <div className="newsletter__row">
        <input
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your@rutgers.edu"
          aria-label={t("newsletter.email")}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "submitting") {
              setState("idle");
              setMessageKey("");
            }
          }}
        />
        <button type="submit" className="btn btn--primary" disabled={state === "submitting"}>
          {buttonLabel}
        </button>
      </div>
      <p className="newsletter__status" data-state={state} aria-live="polite">
        {messageKey ? t(messageKey) : ""}
      </p>
    </form>
  );
}
