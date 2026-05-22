"use client";

import { useEffect, useState } from "react";

export function SmokeTestCta() {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [variant, setVariant] = useState<"A" | "B">("A");

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

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <button type="button" className="btn-cta w-full sm:w-auto" onClick={handleClick}>
        {variant === "A" ? "Uruchom promocje" : "Sprawdz estymacje promocji"}
      </button>
      {status === "saved" && (
        <p className="mt-2 text-[12px] text-green-700">Dzieki. Twoje zainteresowanie zostalo zapisane.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[12px] text-red-700">
          Nie udalo sie zapisac klikniecia. Sprobuj ponownie za chwile.
        </p>
      )}
    </div>
  );
}
