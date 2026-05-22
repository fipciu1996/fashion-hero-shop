"use client";

import { useState } from "react";

export function SmokeTestCta() {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const handleClick = async () => {
    try {
      const response = await fetch("/api/smoke-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "smoke_cta_clicked",
          target: "uruchom_promocje",
          page: "/seller/promoted-listings-smoke",
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
        Uruchom promocje
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
