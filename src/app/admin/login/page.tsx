"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Niepoprawny login lub haslo.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/dashboard/report");
      router.refresh();
    } catch {
      setError("Blad logowania. Sprobuj ponownie.");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-3xl font-light text-charcoal">Admin Login</h1>
      <p className="mt-2 text-[13px] text-warm-gray">Dostep do statystyk smoke testu.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-[0.7px] text-warm-gray">Login</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-[0.7px] text-warm-gray">Haslo</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            required
          />
        </div>

        <button type="submit" className="btn-cta w-full" disabled={submitting}>
          {submitting ? "Logowanie..." : "Zaloguj"}
        </button>

        {error && <p className="text-[12px] text-red-700">{error}</p>}
      </form>
    </main>
  );
}
