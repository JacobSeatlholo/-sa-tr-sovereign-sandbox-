"use client";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-700">
              South Africa–Türkiye Sovereign AI &amp; Digital Trade Sandbox
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              Phase 1 Proof-of-Concept · Prepared by Business Hustle (Simple
              Eternity Holdings (Pty) Ltd) for the Directorate of Communications
              and the Embassy of the Republic of Türkiye.
            </p>
          </div>
          <p className="text-xs text-stone-400 sm:text-right">
            Demo sandbox — registries are illustrative; bulletins carry demo
            keys.
            <br />
            v1.0 · Approved 14 September 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
