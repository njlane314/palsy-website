"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const posthog = usePostHog();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      posthog?.capture("demo_request_submitted", {
        company: payload.company,
        role: payload.role,
      });
      setStatus("sent");
      event.currentTarget.reset();
      return;
    }

    setStatus("error");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="name" placeholder="Name" required />
        <Input name="email" type="email" placeholder="Work email" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="company" placeholder="Company" required />
        <Input name="role" placeholder="Role" />
      </div>
      <Textarea
        name="message"
        placeholder="Tell us about your CI, PyPI/npm usage, and where unapproved packages enter today."
        required
      />
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-fit">
        {status === "sending" ? "Sending..." : "Request demo"}
      </Button>
      {status === "sent" ? (
        <p className="text-sm text-[#31ffd6]">Request received. We will reply by email.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-destructive">The form could not be sent. Email the team directly.</p>
      ) : null}
    </form>
  );
}
