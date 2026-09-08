"use client";

import { FormEvent, useId, useState } from "react";
import { useLang } from "./LangProvider";

type SubmitState = "idle" | "submitting" | "success" | "error";
type Message =
  "invalid" | "unavailable" | "submitting" | "success" | "error" | "timeout";

const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim();
const isValidEmail = (value: string) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const copy = {
  en: {
    label: "Email address",
    subscribe: "Subscribe",
    submittingLabel: "Subscribing…",
    invalid: "Please enter a valid email address.",
    unavailable:
      "Newsletter subscriptions are not open yet. Get updates through the membership form.",
    membership: "Membership form ↗",
    submitting: "Sending your subscription request…",
    success: "You’re on the RUCFC newsletter list. See you in your inbox.",
    error: "We couldn’t complete your subscription. Please try again.",
    timeout: "The request timed out. Please try again.",
  },
  zh: {
    label: "邮箱地址",
    subscribe: "订阅",
    submittingLabel: "订阅中…",
    invalid: "请输入有效的邮箱地址。",
    unavailable: "邮件订阅服务暂未开放，可通过入会表获取社团消息。",
    membership: "前往入会表 ↗",
    submitting: "正在发送订阅申请…",
    success: "你已加入 RUCFC 邮件订阅名单，期待与你在邮箱相见。",
    error: "订阅未完成，请稍后再试。",
    timeout: "请求超时，请稍后再试。",
  },
};

export default function NewsletterForm() {
  const { lang } = useLang();
  const text = copy[lang];
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting") return;
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setState("error");
      setMessage("invalid");
      return;
    }

    if (!NEWSLETTER_ENDPOINT) {
      setState("error");
      setMessage("unavailable");
      return;
    }

    setState("submitting");
    setMessage("submitting");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email: normalizedEmail,
          list: "RUCFC Newsletter",
          language: lang,
          source: "rucfc-website",
          page: window.location.href,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Newsletter request failed.");
      setEmail("");
      setState("success");
      setMessage("success");
    } catch {
      setState("error");
      setMessage(controller.signal.aborted ? "timeout" : "error");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <form
      className="newsletter-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={state === "submitting"}
    >
      <div className="newsletter-field">
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="your@rutgers.edu"
          required
          maxLength={254}
          disabled={state === "submitting"}
          aria-label={text.label}
          aria-describedby={statusId}
          aria-invalid={message === "invalid"}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setState("idle");
            setMessage(null);
          }}
        />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? text.submittingLabel : text.subscribe}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p
        id={statusId}
        className={`newsletter-status ${state === "error" ? "error" : state === "success" ? "success" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message ? text[message] : ""}
        {message === "unavailable" && (
          <>
            {" "}
            <a href="#join">{text.membership}</a>
          </>
        )}
      </p>
    </form>
  );
}
