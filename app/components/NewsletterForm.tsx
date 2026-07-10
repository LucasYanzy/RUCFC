"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLang } from "./LangProvider";

type SubmitState = "idle" | "submitting" | "success" | "error";

const STORAGE_KEY = "rucf-newsletter-subscribers";
const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function saveLocalSubscriber(email: string) {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  let existing: Array<{ email: string; createdAt: string }> = [];

  try {
    existing = raw ? (JSON.parse(raw) as Array<{ email: string; createdAt: string }>) : [];
  } catch {
    existing = [];
  }

  const normalized = email.toLowerCase();

  if (!existing.some((item) => item.email.toLowerCase() === normalized)) {
    existing.push({ email: normalized, createdAt: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export default function NewsletterForm() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [messageKey, setMessageKey] = useState("newsletter.helper");

  const buttonLabel = useMemo(() => {
    if (state === "submitting") return t("newsletter.submitting");
    if (state === "success") return t("newsletter.subscribed");
    return t("footer.subscribe");
  }, [state, t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
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
            email: normalizedEmail,
            list: "RUCF Newsletter",
            language: lang,
            source: "rucf-website",
            page: window.location.href,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error("Newsletter endpoint rejected the request.");
      } else {
        saveLocalSubscriber(normalizedEmail);
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
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <div className="newsletter-field">
        <input
          type="email"
          placeholder="your@rutgers.edu"
          required
          aria-label={t("newsletter.email")}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "submitting") {
              setState("idle");
              setMessageKey("newsletter.helper");
            }
          }}
        />
        <p
          className={`newsletter-status ${state === "error" ? "error" : state === "success" ? "success" : ""}`}
          aria-live="polite"
        >
          {t(messageKey)}
        </p>
      </div>
      <button type="submit" disabled={state === "submitting"}>
        {buttonLabel}
      </button>
    </form>
  );
}
