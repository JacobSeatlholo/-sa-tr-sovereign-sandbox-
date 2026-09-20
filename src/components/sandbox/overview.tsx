"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Building2,
  Fingerprint,
  Globe2,
  Handshake,
  Languages,
  Landmark,
  Lock,
  Newspaper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  active: {
    label: "● This build",
    className: "bg-emerald-600 text-white border-emerald-600",
  },
  next: {
    label: "Next",
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  future: {
    label: "Future",
    className: "bg-stone-100 text-stone-600 border-stone-300",
  },
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

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-red-50 p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
              Phase 1 · Proof-of-Concept Sandbox
            </Badge>
            <Badge variant="outline" className="border-stone-300 text-stone-600">
              Building the Future Together
            </Badge>
          </div>
          <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            South Africa–Türkiye{" "}
            <span className="text-emerald-700">Sovereign AI &amp; Digital Trade</span>{" "}
            Sandbox
          </h1>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            The Joint Bilateral AI &amp; Digital Trade Engine proposed to the
            Directorate of Communications (Presidency of Türkiye) — bridging
            diplomatic strategy and private-sector trade execution. This live
            Phase 1 deployment demonstrates automated TR↔EN policy analysis,
            cryptographically verifiable communications against AI deepfakes,
            and semantic matching of South African SMMEs with Turkish buyers
            under AfCFTA guidelines.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onJump("policy")}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
              Analyse a policy text
            </button>
            <button
              onClick={() => onJump("bulletins")}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Verify a bulletin
            </button>
            <button
              onClick={() => onJump("trade")}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <Handshake className="h-4 w-4" aria-hidden="true" />
              Match trade partners
            </button>
          </div>
        </div>
      </section>

      {/* Live metrics */}
      <section aria-label="Live sandbox metrics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                tone="green"
              />
              <StatCard
                icon={Newspaper}
                label="Bulletins sealed"
                value={stats.bulletinsSealed}
                hint="SHA-256 + Ed25519 digital seals"
                tone="gold"
              />
              <StatCard
                icon={Fingerprint}
                label="Verifications"
                value={stats.verificationsPerformed}
                hint="Stateless integrity checks run"
                tone="red"
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
          <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Active signing key fingerprint:{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[11px] text-stone-700">
              {fingerprint}
            </code>
          </p>
        ) : null}
      </section>

      {/* Two pillars */}
      <section aria-label="Technical pillars">
        <SectionHeading
          eyebrow="System architecture"
          title="Two pillars, one execution bridge"
          description="High-level policy must translate into functional software infrastructure. The sandbox demonstrates the two technical pillars defined in the approved proposal."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <PillarCard
            icon={Languages}
            pillar="Pillar 1 · Diplomatic Knowledge Hub"
            title="Policy NLP & Cryptographic Verification"
            accent="green"
            points={[
              "Automated multilingual NLP — real-time TR↔EN policy extraction, translation and structured commitment tracking",
              "Information Integrity Engine — every bulletin sealed with a SHA-256 digest and Ed25519 PKI digital signature",
              "Verified Information Repository — media and citizens verify authentic state communications instantly",
            ]}
          />
          <PillarCard
            icon={ArrowLeftRight}
            pillar="Pillar 2 · Cross-Border Trade Engine"
            title="Cross-Border Trade Matchmaker"
            accent="red"
            points={[
              "Civic data integration — surfaces verified South African SMMEs (OpenTender ZA & BlackBiz registries in Phase 2)",
              "Semantic vector search — cosine-similarity scoring matches SA suppliers with Turkish enterprise buyers",
              "AfCFTA alignment — matching framed by continental trade guidelines and certificate-of-origin readiness",
            ]}
          />
        </div>
      </section>

      {/* Roadmap */}
      <section aria-label="Implementation roadmap">
        <SectionHeading
          eyebrow="Implementation roadmap & financial sandbox"
          title="A lean, low-risk execution strategy"
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {ROADMAP.map((phase) => {
            const badge = STATUS_BADGE[phase.status];
            return (
              <Card key={phase.phase} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold text-stone-900">
                      {phase.phase}: {phase.title}
                    </CardTitle>
                    <Badge variant="outline" className={badge.className}>
                      {badge.label}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {phase.timeline} · {phase.investment}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <ul className="space-y-1.5">
                    {phase.scope.map((s) => (
                      <li
                        key={s}
                        className="flex gap-2 text-xs text-stone-600 leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 shrink-0"
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

      {/* Coalition */}
      <section aria-label="Coalition ecosystem">
        <SectionHeading
          eyebrow="Multi-institutional coalition"
          title="Ecosystem stakeholders"
          description="The platform is developed to integrate across key foreign policy, economic and educational bodies identified in the proposal."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COALITION.map((m) => (
            <Card key={m.institution}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2.5">
                  <Landmark
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                      {m.domain}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-stone-800">
                      {m.institution}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">{m.focus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Deployment note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
            About this deployment
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            This is the Phase 1 proof-of-concept build (Next.js App Router +
            TypeScript, Vercel-ready). Company registries are illustrative demo
            data standing in for OpenTender ZA / BlackBiz / chamber registries;
            bulletins are signed with the sandbox demo keypair and remain
            independently verifiable. Production rollout (Phase 2) adds the
            multi-tenant database, live civic-data integrations and
            POPIA/GDPR compliance hardening.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            <span>
              Verifiable by design — every seal can be checked without trusting
              this server.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
