"use client";

import { Github } from "lucide-react";

/**
 * Bilateral Programme Seal — engraved roundel, gold on navy.
 * Pure vector: double ring, star accents, serif monogram.
 */
function ProgrammeSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Joint bilateral programme seal"
    >
      <circle cx="32" cy="32" r="30.5" fill="none" stroke="#C9A961" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#C9A961" strokeWidth="0.6" />
      {/* cardinal stars */}
      <path d="M32 3.5 33.1 6.2 35.8 7.3 33.1 8.4 32 11.1 30.9 8.4 28.2 7.3 30.9 6.2Z" fill="#C9A961" transform="translate(0 -1)" />
      <path d="M32 52.9 33.1 55.6 35.8 56.7 33.1 57.8 32 60.5 30.9 57.8 28.2 56.7 30.9 55.6Z" fill="#C9A961" transform="translate(0 -1)" />
      <text
        x="32"
        y="36.5"
        textAnchor="middle"
        fill="#C9A961"
        fontSize="12.5"
        letterSpacing="1.5"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 600 }}
      >
        ZA·TR
      </text>
      <path d="M17 40.5h30" stroke="#C9A961" strokeWidth="0.6" />
      <text
        x="32"
        y="47"
        textAnchor="middle"
        fill="#9FB0C5"
        fontSize="4.6"
        letterSpacing="1.9"
        style={{ fontFamily: "var(--font-public-sans), sans-serif", fontWeight: 600 }}
      >
        MMXXVI
      </text>
    </svg>
  );
}

/**
 * Source repository URL — after pushing to GitHub, set this to the live
 * repository address (e.g. "https://github.com/<your-username>/sa-tr-sovereign-sandbox").
 */
const SOURCE_REPOSITORY_URL = "https://github.com/JacobSeatlholo/-sa-tr-sovereign-sandbox-";

export function Header() {
  return (
    <header>
      {/* Official banner strip */}
      <div className="bg-navy-deep text-[#9FB0C5]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em]">
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-gold-bright" />
            <span className="truncate">
              Official demonstration platform · Phase I proof of concept
            </span>
          </span>
          <span className="hidden shrink-0 sm:block">Est. MMXXVI</span>
        </div>
      </div>

      {/* Masthead */}
      <div className="engraved border-b border-navy-line bg-navy">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:items-center sm:gap-5">
          <ProgrammeSeal className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.28em] text-gold-bright sm:text-[10px]">
              <span aria-hidden="true" className="hidden h-px w-6 bg-gold-bright/70 sm:block" />
              Joint Bilateral Engine — Republic of South Africa · Republic of Türkiye
            </p>
            <p className="mt-1.5 font-serif text-lg font-semibold leading-tight text-[#F2EFE7] sm:text-[1.7rem] sm:leading-[1.15]">
              Sovereign AI &amp; Digital Trade Sandbox
            </p>
            <p className="mt-1 hidden text-[11px] font-medium tracking-[0.08em] text-[#93A3B8] sm:block">
              Diplomatic Intelligence · Information Integrity · Trade Execution · Live Demonstration
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2.5 md:flex">
            <span className="border border-[#3A506B] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9FB0C5]">
              Sandbox Build · v2.0
            </span>
            <a
              href={SOURCE_REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-transparent px-1 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#93A3B8] transition-colors hover:text-gold-bright"
              aria-label="Source repository on GitHub"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Source
            </a>
          </div>
        </div>
        {/* Document double rule */}
        <div aria-hidden="true" className="border-t-2 border-gold-bright/80" />
        <div aria-hidden="true" className="mt-[3px] border-t border-gold-bright/25" />
      </div>
    </header>
  );
}
