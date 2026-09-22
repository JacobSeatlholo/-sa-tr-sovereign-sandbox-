"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Building2,
  Fingerprint,
  Landmark,
  Languages,
  Network,
  Newspaper,
  Play,
  Terminal,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PillarCard,
  SectionHeading,
  StatCard,
  StatCardSkeleton,
} from "./shared";
import type { SandboxStats } from "@/lib/types";
import { COALITION, ROADMAP } from "@/lib/overview-content";

const STATUS_BADGE = {
  active: { label: "In execution · this build", className: "bg-navy text-[#F2EFE7] border-navy" },
  next: { label: "Next phase", className: "border-gold/70 text-gold-ink bg-gold-soft" },
  future: { label: "Planned", className: "border-[#9AA3AE] text-[#3D4650] bg-[#F1F2F0]" },
} as const;

export function Overview({ onJump }: { onJump: (tab: string) => void }) {
  const [stats, setStats] = useState<SandboxStats | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setStats(d.stats);
        setFingerprint(d.publicKeyFingerprint);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const primaryBtn =
    "inline-flex items-center gap-2 bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-deep transition-colors hover:bg-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-navy";
  const secondaryBtn =
    "inline-flex items-center gap-2 border border-[#3A506B] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#E8E4D8] transition-colors hover:border-gold-bright hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

  return (
    <div className="space-y-12">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="engraved bg-navy p-7 sm:p-12">
        <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-bright sm:text-[11px]">
          <span aria-hidden="true" className="h-px w-8 bg-gold-bright" />
          Joint Bilateral Initiative · Phase I Proof of Concept
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-[1.9rem] font-semibold leading-[1.16] text-[#F2EFE7] sm:text-[2.9rem]">
          South Africa–Türkiye Sovereign AI &amp; Digital Trade Sandbox
        </h1>
        <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-bright/80" />
        <p className="mt-6 max-w-3xl text-sm leading-[1.85] text-[#B9C4D2] sm:text-[15px]">
          The Joint Bilateral AI &amp; Digital Trade Engine, proposed to the
          Directorate of Communications (Presidency of Türkiye) and the Embassy
          of the Republic of Türkiye. This live deployment demonstrates three
          sovereign capabilities: automated TR↔EN policy analysis with
          structured commitment tracking; cryptographically verifiable state
          communications that withstand AI-generated falsification; and
          semantic matching of South African SMMEs with Turkish enterprise
          buyers under AfCFTA guidelines.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => onJump("console")} className={primaryBtn}>
            <Play className="h-4 w-4" aria-hidden="true" />
            Run the demonstration protocol
          </button>
          <button onClick={() => onJump("policy")} className={secondaryBtn}>
            <Languages className="h-4 w-4" aria-hidden="true" />
            Analyse a policy text
          </button>
          <button onClick={() => onJump("bulletins")} className={secondaryBtn}>
            Verify a bulletin
          </button>
          <button onClick={() => onJump("architecture")} className={secondaryBtn}>
            <Network className="h-4 w-4" aria-hidden="true" />
            Production architecture
          </button>
        </div>
      </section>

      {/* ── Live metrics ─────────────────────────────────────────────── */}
      <section aria-label="Live sandbox metrics">
        <SectionHeading
          eyebrow="Registry status"
          title="Operations at a glance"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading || !stats ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={Languages}
                label="Policy analyses"
                value={stats.policyAnalyses}
                hint="TR↔EN extractions performed"
              />
              <StatCard
                icon={Newspaper}
                label="Bulletins sealed"
                value={stats.bulletinsSealed}
                hint="SHA-256 digest + Ed25519 seal"
              />
              <StatCard
                icon={Fingerprint}
                label="Verifications"
                value={stats.verificationsPerformed}
                hint="Stateless integrity checks run"
              />
              <StatCard
                icon={Building2}
                label="Registry entries"
                value={stats.companiesListed}
                hint="SA suppliers ↔ TR buyers (demo)"
              />
            </>
          )}
        </div>
        {!loading && fingerprint ? (
          <p className="mt-4 flex flex-wrap items-center gap-1.5 border border-hairline bg-card px-3.5 py-2.5 text-[11px] text-ink-soft">
            <span className="font-bold uppercase tracking-[0.16em] text-gold-ink">
              Active signing key
            </span>
            <code className="break-all bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink">
              {fingerprint}
            </code>
          </p>
        ) : null}
      </section>

      {/* ── Pillars ──────────────────────────────────────────────────── */}
      <section aria-label="Technical pillars">
        <SectionHeading
          eyebrow="System architecture"
          title="Two pillars, one execution bridge"
          description="High-level policy must translate into functional software infrastructure. The sandbox demonstrates the two technical pillars defined in the approved proposal."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PillarCard
            icon={Languages}
            numeral="Pillar I"
            title="Policy NLP & Cryptographic Verification"
            points={[
              "Automated multilingual NLP — real-time TR↔EN policy extraction, translation and structured commitment tracking",
              "Information Integrity Engine — every bulletin sealed with a SHA-256 digest and Ed25519 PKI digital signature",
              "Verified Information Repository — media and citizens verify authentic state communications instantly",
            ]}
          />
          <PillarCard
            icon={ArrowLeftRight}
            numeral="Pillar II"
            title="Cross-Border Trade Matchmaker"
            points={[
              "Civic data integration — surfaces verified South African SMMEs (OpenTender ZA & BlackBiz registries in Phase 2)",
              "Semantic vector search — cosine-similarity scoring matches SA suppliers with Turkish enterprise buyers",
              "AfCFTA alignment — matching framed by continental trade guidelines and certificate-of-origin readiness",
            ]}
          />
        </div>
      </section>

      {/* ── Demonstration pathways ──────────────────────────────────── */}
      <section aria-label="Demonstration pathways">
        <SectionHeading
          eyebrow="For the visiting delegation"
          title="Two ways to witness the platform at work"
          description="The console executes every capability live before your eyes; the architecture dossier documents exactly how the same system graduates to production."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border-hairline border-l-2 border-l-gold bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="bg-navy px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#F2EFE7]">
                  Live
                </span>
                <div className="border border-hairline p-1.5 text-navy-mid">
                  <Terminal className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-navy">
                Sandbox Console — five scenes, one protocol
              </h3>
              <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold" />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                A guided protocol seals a state communiqué, verifies it,
                stages an adversarial tampering attack and defeats it
                cryptographically, then matches trade counterparties — while a
                privileged command console and a live operations ledger record
                every action.
              </p>
              <button
                onClick={() => onJump("console")}
                className="mt-5 inline-flex items-center gap-2 bg-gold px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-navy-deep transition-colors hover:bg-gold-bright"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Open the console
              </button>
            </CardContent>
          </Card>
          <Card className="border-hairline border-l-2 border-l-gold bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="bg-navy px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#F2EFE7]">
                  Dossier
                </span>
                <div className="border border-hairline p-1.5 text-navy-mid">
                  <Network className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-navy">
                Architecture — the production pathway
              </h3>
              <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold" />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Six-tier deployment topology, the verified-communication
                lifecycle, the environment matrix from sandbox to sovereign
                production, the security and compliance model, the GitHub-to-
                Vercel pipeline and the reliability posture — in full.
              </p>
              <button
                onClick={() => onJump("architecture")}
                className="mt-5 inline-flex items-center gap-2 border border-navy px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:border-gold hover:text-gold-ink"
              >
                <Network className="h-3.5 w-3.5" aria-hidden="true" />
                Read the dossier
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Roadmap ──────────────────────────────────────────────────── */}
      <section aria-label="Implementation roadmap">
        <SectionHeading
          eyebrow="Implementation roadmap & financial framework"
          title="A lean, low-risk execution strategy"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ROADMAP.map((phase) => {
            const badge = STATUS_BADGE[phase.status];
            return (
              <Card key={phase.phase} className="flex flex-col border-hairline bg-card">
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-base font-semibold text-navy">
                      {phase.phase}
                    </p>
                    <span
                      className={`shrink-0 border px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.16em] ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {phase.title}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-gold-ink">
                    {phase.timeline} · {phase.investment}
                  </p>
                  <div aria-hidden="true" className="my-3 h-px bg-hairline" />
                  <ul className="space-y-2">
                    {phase.scope.map((s) => (
                      <li
                        key={s}
                        className="flex gap-2 text-xs leading-relaxed text-ink-soft"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[6px] h-1 w-1 shrink-0 bg-gold"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Coalition ────────────────────────────────────────────────── */}
      <section aria-label="Coalition ecosystem">
        <SectionHeading
          eyebrow="Multi-institutional coalition"
          title="Ecosystem stakeholders"
          description="The platform is developed to integrate across key foreign policy, economic and educational bodies identified in the proposal."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COALITION.map((m) => (
            <Card key={m.institution} className="border-hairline border-l-2 border-l-gold bg-card">
              <CardContent className="flex items-start gap-3 p-4">
                <Landmark
                  className="mt-0.5 h-4 w-4 shrink-0 text-navy-mid"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <div className="min-w-0">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-gold-ink">
                    {m.domain}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-navy">
                    {m.institution}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {m.focus}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── About this deployment ────────────────────────────────────── */}
      <section aria-label="About this deployment">
        <Card className="border-hairline bg-card">
          <CardContent className="p-6">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gold-ink">
              <span aria-hidden="true" className="h-px w-6 bg-gold" />
              About this deployment
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-[1.85] text-ink-soft">
              This is the Phase 1 proof-of-concept build (Next.js App Router +
              TypeScript, Vercel-ready). Company registries are illustrative
              demo data standing in for OpenTender ZA / BlackBiz / chamber
              registries; bulletins are sealed with the sandbox demo keypair
              and remain independently verifiable. Production rollout (Phase 2)
              adds the multi-tenant database, live civic-data integrations and
              POPIA/GDPR compliance hardening.
            </p>
            <p className="mt-4 border-l-2 border-gold bg-gold-soft px-4 py-3 text-xs font-medium leading-relaxed text-gold-ink">
              Verifiable by design — every seal can be checked without trusting
              this server.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
