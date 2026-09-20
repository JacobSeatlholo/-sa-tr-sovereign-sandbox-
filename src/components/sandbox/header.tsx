"use client";

import { Github, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 text-base font-bold text-white shadow-sm"
          >
            <span className="tracking-tighter">ZA</span>
            <span className="mx-0.5 text-amber-400">·</span>
            <span className="tracking-tighter">TR</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-stone-900">
              Sovereign AI &amp; Digital Trade Sandbox
            </p>
            <p className="truncate text-xs text-stone-500">
              🇿🇦 South Africa ⇄ Türkiye 🇹🇷 · Bilateral Digital Trade Engine
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge className="hidden bg-emerald-700 text-white hover:bg-emerald-700 sm:inline-flex">
            <ShieldCheck className="mr-1 h-3 w-3" aria-hidden="true" />
            Phase 1 PoC
          </Badge>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition hover:bg-stone-50"
            aria-label="Source repository (set your GitHub URL in header.tsx)"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
