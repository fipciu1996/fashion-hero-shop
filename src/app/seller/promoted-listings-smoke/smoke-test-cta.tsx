"use client";

import { useEffect, useState } from "react";

export function SmokeTestCta() {
  const [status, setStatus] = useState<"idle" | "saved" | "error" | "already">("idle");
  const [variant, setVariant] = useState<"A" | "B">("A");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storageKey = "fh_smoke_variant";
    const existing = window.localStorage.getItem(storageKey);

    if (existing === "A" || existing === "B") {
      setVariant(existing);
      return;
    }

    const assigned = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(storageKey, assigned);
    setVariant(assigned);
  }, []);

  const handleClick = async () => {
    if (isSubmitting || status === "saved" || status === "already") {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/smoke-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "smoke_cta_clicked",
          target: "uruchom_promocje",
          page: "/seller/promoted-listings-smoke",
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Tracking failed");
      }

      const data = (await response.json()) as { counted?: boolean };
      setStatus(data.counted ? "saved" : "already");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn-cta w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleClick}
        disabled={isSubmitting || status === "saved" || status === "already"}
      >
        {isSubmitting
          ? "Saving..."
          : variant === "A"
            ? "Launch promotion"
            : "Check promotion estimate"}
      </button>
      {status === "saved" && (
        <p className="mt-2 text-[12px] text-green-700">Thanks. Your interest has been recorded.</p>
      )}
      {status === "already" && (
        <p className="mt-2 text-[12px] text-warm-gray">
          This click has already been counted for this user.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[12px] text-red-700">
          We could not save your click. Please try again in a moment.
        </p>
      )}
    </div>
  );
}
