"use client";

import {
  ArrowDown,
  Building2,
  CheckCircle2,
  Circle,
  Database,
  GitBranch,
  Globe2,
  Landmark,
  Lock,
  Network,
  Rocket,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionHeading } from "./shared";

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM ARCHITECTURE & PRODUCTION PATHWAY
//
// An engineering dossier rendered in the institutional register: deployment
// topology, request lifecycle, environment matrix, security & compliance,
// CI/CD pipeline, reliability posture and the readiness checklist.
// ─────────────────────────────────────────────────────────────────────────────

function TierConnector() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1">
      <ArrowDown className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />
    </div>
  );
}

function TierBand({
  tier,
  label,
  icon: Icon,
  nodes,
  accent = false,
}: {
  tier: string;
  label: string;
  icon: typeof Globe2;
  nodes: { name: string; note: string }[];
  accent?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[190px_1fr]">
      <div
        className={`flex items-start gap-2.5 border p-3 ${
          accent ? "border-gold/60 bg-gold-soft" : "border-navy-line bg-navy"
        }`}
      >
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-gold-ink" : "text-gold-bright"}`}
          aria-hidden="true"
          strokeWidth={1.75}
        />
        <div>
          <p
            className={`text-[8.5px] font-bold uppercase tracking-[0.22em] ${
              accent ? "text-gold-ink" : "text-[#7E8FA3]"
            }`}
          >
            {tier}
          </p>
          <p
            className={`mt-0.5 font-serif text-sm font-semibold leading-tight ${
              accent ? "text-navy" : "text-[#F2EFE7]"
            }`}
          >
            {label}
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {nodes.map((n) => (
          <div key={n.name} className="border border-hairline bg-white px-3 py-2.5">
            <p className="text-xs font-semibold leading-snug text-navy">{n.name}</p>
            <p className="mt-0.5 text-[10.5px] leading-snug text-ink-soft">{n.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeploymentTopology() {
  return (
    <section aria-label="Deployment topology" className="space-y-4">
      <TierBand
        tier="Tier 1"
        label="Experience"
        icon={Globe2}
        nodes={[
          { name: "Diplomatic dashboard", note: "This deployment — privileged session" },
          { name: "Public verification portal", note: "Citizen & media seal checks" },
          { name: "Chamber registry APIs", note: "SACCI / RCCI member onboarding" },
        ]}
      />
      <TierConnector />
      <TierBand
        tier="Tier 2"
        label="Edge & Perimeter"
        icon={Network}
        nodes={[
          { name: "Vercel Edge Network", note: "Global CDN · geo routing · TLS 1.3" },
          { name: "Web application firewall", note: "OWASP filtering · bot mitigation" },
          { name: "Rate limiting & DDoS shield", note: "Per-token quotas at the edge" },
        ]}
      />
      <TierConnector />
      <TierBand
        tier="Tier 3"
        label="Application"
        icon={Building2}
        nodes={[
          { name: "Next.js 16 App Router", note: "SSR dashboard + route handlers" },
          { name: "NextAuth SSO gateway", note: "Ministry identity · MFA (Phase 2)" },
          { name: "Session & policy guard", note: "RBAC scopes per facility" },
        ]}
      />
      <TierConnector />
      <TierBand
        tier="Tier 4"
        label="Intelligence & Integrity"
        icon={ShieldCheck}
        accent
        nodes={[
          { name: "Policy NLP pipeline", note: "TR↔EN analysis · commitment extraction" },
          { name: "Integrity Engine", note: "SHA-256 digest · Ed25519 seal → HSM" },
          { name: "Matchmaker service", note: "Vector similarity — pgvector (Phase 2)" },
          { name: "Operations ledger", note: "Append-only audit stream" },
        ]}
      />
      <TierConnector />
      <TierBand
        tier="Tier 5"
        label="Data & Persistence"
        icon={Database}
        nodes={[
          { name: "PostgreSQL 16 · multi-tenant", note: "Row-level security · PITR backups" },
          { name: "Object storage", note: "Signed documents · sealed artefacts" },
          { name: "Vector store", note: "Company & policy embeddings" },
        ]}
      />
      <TierConnector />
      <TierBand
        tier="Tier 6"
        label="Civic Integrations"
        icon={Landmark}
        nodes={[
          { name: "OpenTender ZA", note: "Verified supplier registry feed" },
          { name: "BlackBiz registry", note: "SMME discovery & verification" },
          { name: "SACCI · ProcureTrade", note: "Enterprise onboarding & execution" },
        ]}
      />

      {/* Cross-cutting plane */}
      <div className="border border-dashed border-navy-line bg-paper px-4 py-3.5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold-ink">
          Cross-cutting plane — all tiers
        </p>
        <div className="mt-2 grid gap-2 text-xs text-ink sm:grid-cols-4">
          <p>
            <span className="font-semibold text-navy">Observability —</span> logs,
            metrics, traces, uptime probes
          </p>
          <p>
            <span className="font-semibold text-navy">Secrets &amp; KMS —</span>{" "}
            managed vault · env-scoped credentials
          </p>
          <p>
            <span className="font-semibold text-navy">CI/CD —</span> GitHub Actions →
            Vercel pipelines
          </p>
          <p>
            <span className="font-semibold text-navy">Audit ledger —</span> immutable
            record of state-changing actions
          </p>
        </div>
      </div>
    </section>
  );
}

const LIFECYCLE: { numeral: string; title: string; body: string }[] = [
  {
    numeral: "I",
    title: "Publication",
    body: "An authorised issuer composes the bulletin. The engine serialises a deterministic canonical form — title, issuer, classification, body and timestamp joined by a fixed delimiter — so every verifier reconstructs identical bytes.",
  },
  {
    numeral: "II",
    title: "Digest",
    body: "A SHA-256 digest is computed over the canonical bytes. Any alteration to a single character of the bulletin produces a completely different digest, which is the property that makes tampering detectable.",
  },
  {
    numeral: "III",
    title: "Seal",
    body: "The Integrity Engine affixes an Ed25519 signature over the canonical form. In production the private key never leaves an HSM; this sandbox uses a clearly-marked demo keypair with identical mathematics.",
  },
  {
    numeral: "IV",
    title: "Distribution",
    body: "The sealed bulletin is registered and served through the edge network. The seal travels with the content — verification does not require access to the issuing system.",
  },
  {
    numeral: "V",
    title: "Challenge",
    body: "Any party — journalist, citizen, embassy — submits the content and its seal to the verification endpoint. No account, no session and no trust in this server is required.",
  },
  {
    numeral: "VI",
    title: "Verdict",
    body: "The digest is recomputed and the signature is checked against the official public key. The verdict is issued statelessly in milliseconds and is reproducible by any independent implementation.",
  },
  {
    numeral: "VII",
    title: "Ledger",
    body: "The attempt is written to the append-only operations ledger, giving officials a tamper-evident record of every seal, challenge and rejection — the evidentiary backbone for Phase 2 persistence.",
  },
];

function LifecycleSection() {
  return (
    <section aria-label="Request lifecycle">
      <div className="grid gap-3 md:grid-cols-2">
        {LIFECYCLE.map((s) => (
          <div key={s.numeral} className="border border-hairline bg-card p-4">
            <div className="flex items-baseline gap-2.5">
              <span className="bg-navy px-1.5 py-0.5 font-serif text-[12px] font-semibold text-[#F2EFE7]">
                {s.numeral}
              </span>
              <h4 className="font-serif text-base font-semibold text-navy">{s.title}</h4>
            </div>
            <p className="mt-2 text-xs leading-[1.75] text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EnvironmentMatrix() {
  const rows: { capability: string; sandbox: string; production: string }[] = [
    {
      capability: "Persistence",
      sandbox: "In-memory registry — seals remain independently verifiable across restarts",
      production: "PostgreSQL 16 multi-tenant with row-level security and PITR backups",
    },
    {
      capability: "Key custody",
      sandbox: "Embedded demo keypair, clearly marked and rotated before any real use",
      production: "HSM/KMS custody with documented key ceremony and scheduled rotation",
    },
    {
      capability: "AI inference",
      sandbox: "Shared sandbox LLM pipeline with graceful degradation",
      production: "Dedicated inference cluster behind private endpoints",
    },
    {
      capability: "Matching engine",
      sandbox: "In-process TF-IDF cosine similarity — deterministic, serverless-safe",
      production: "pgvector embeddings with approximate-nearest-neighbour indexing",
    },
    {
      capability: "Registry integrations",
      sandbox: "Illustrative demo registries standing in for civic data",
      production: "Live OpenTender ZA, BlackBiz, SACCI and ProcureTrade APIs",
    },
    {
      capability: "Identity & access",
      sandbox: "Single shared demonstration session",
      production: "NextAuth SSO, ministry-scoped RBAC and mandatory MFA",
    },
    {
      capability: "Audit trail",
      sandbox: "In-memory operations ledger (this console streams it live)",
      production: "Append-only ledger with export, retention and legal-hold policy",
    },
  ];

  return (
    <div className="border border-hairline">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-hairline bg-navy hover:bg-navy">
            <TableHead className="w-[150px] text-[9px] font-bold uppercase tracking-[0.18em] text-[#7E8FA3]">
              Capability
            </TableHead>
            <TableHead className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold-bright">
              Phase I — this sandbox
            </TableHead>
            <TableHead className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold-bright">
              Phase II — production
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.capability} className="border-b border-hairline/70 last:border-0">
              <TableCell className="align-top text-xs font-semibold text-navy">
                {r.capability}
              </TableCell>
              <TableCell className="align-top text-xs leading-relaxed text-ink-soft">
                {r.sandbox}
              </TableCell>
              <TableCell className="align-top text-xs leading-relaxed text-ink-soft">
                {r.production}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SecurityCompliance() {
  const rows: { domain: string; control: string; status: string }[] = [
    {
      domain: "Data protection",
      control:
        "POPIA (ZA), GDPR (EU) and KVKK (TR) aligned processing; regional data residency selectable at deployment",
      status: "Phase 2 hardening",
    },
    {
      domain: "Transport security",
      control:
        "TLS 1.3 on every hop, HSTS enforced, hardened security headers shipped via vercel.json",
      status: "Active in this build",
    },
    {
      domain: "Cryptography",
      control:
        "SHA-256 digests and Ed25519 seals (RFC 8032); HSM-backed custody and key ceremony in production",
      status: "Active · custody Phase 2",
    },
    {
      domain: "Access control",
      control:
        "Edge rate limiting today; SSO with ministry-scoped RBAC and MFA at production rollout",
      status: "Phase 2",
    },
    {
      domain: "Assurance",
      control:
        "Continuous security audits (Phase 3 scope) with SOC 2 Type II and ISO 27001 certification roadmap",
      status: "Roadmap",
    },
    {
      domain: "Trade frameworks",
      control:
        "AfCFTA digital trade protocol alignment; e-signature and customs digitalisation harmonisation workstream",
      status: "Standing workstream",
    },
  ];

  return (
    <div className="border border-hairline">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-hairline bg-navy hover:bg-navy">
            <TableHead className="w-[150px] text-[9px] font-bold uppercase tracking-[0.18em] text-[#7E8FA3]">
              Domain
            </TableHead>
            <TableHead className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold-bright">
              Control
            </TableHead>
            <TableHead className="w-[150px] text-[9px] font-bold uppercase tracking-[0.18em] text-gold-bright">
              Disposition
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.domain} className="border-b border-hairline/70 last:border-0">
              <TableCell className="align-top text-xs font-semibold text-navy">
                {r.domain}
              </TableCell>
              <TableCell className="align-top text-xs leading-relaxed text-ink-soft">
                {r.control}
              </TableCell>
              <TableCell className="align-top">
                <span className="inline-block border border-gold/50 bg-gold-soft px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-gold-ink">
                  {r.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PipelineSection() {
  const steps: { icon: typeof GitBranch; title: string; body: string }[] = [
    {
      icon: GitBranch,
      title: "Commit",
      body: "Source of truth is the GitHub repository. All changes land through pull requests — no direct production writes.",
    },
    {
      icon: Workflow,
      title: "CI gate",
      body: "GitHub Actions runs lint, typecheck and a production build on every push. The workflow ships with this repository at .github/workflows/ci.yml.",
    },
    {
      icon: Globe2,
      title: "Preview",
      body: "Vercel provisions an isolated preview deployment per pull request for technical and diplomatic review before promotion.",
    },
    {
      icon: Rocket,
      title: "Production",
      body: "Merge to main promotes the verified build to production on Vercel's edge network, with instant rollback to any prior deployment.",
    },
    {
      icon: Lock,
      title: "Operate",
      body: "Secrets are environment-scoped, security headers are declared in vercel.json, and the operations ledger provides continuous auditability.",
    },
  ];

  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {steps.map((s, i) => (
        <li key={s.title} className="relative border border-hairline bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="border border-hairline p-1.5 text-navy-mid">
              <s.icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[10px] font-bold text-gold-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-navy">{s.title}</p>
          <p className="mt-1.5 text-[11px] leading-[1.7] text-ink-soft">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

function ReliabilitySection() {
  const stats: { value: string; label: string; note: string }[] = [
    { value: "99.9%", label: "Target availability", note: "Managed edge SLA at production rollout" },
    { value: "≤ 15 min", label: "Recovery point", note: "Continuous WAL archiving · PITR" },
    { value: "≤ 60 min", label: "Recovery time", note: "Documented failover runbook" },
    { value: "Multi-region", label: "Failover posture", note: "Active-passive regional deployment" },
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-hairline bg-card">
            <CardContent className="p-4">
              <div aria-hidden="true" className="mb-3 h-[2px] w-8 bg-gold" />
              <p className="font-serif text-2xl font-semibold tabular-nums leading-none text-navy">
                {s.value}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                {s.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink-soft">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-4 max-w-4xl text-xs leading-[1.8] text-ink-soft">
        Backups are encrypted, integrity-checked and restored rehearsed quarterly.
        The disaster-recovery runbook defines roles, communication trees and
        escalation thresholds; recovery objectives are validated by scheduled
        game-day exercises rather than assumed. Registry data and the audit
        ledger replicate across regions, so a regional failure degrades capacity
        without losing a single sealed record.
      </p>
    </div>
  );
}

function ReadinessChecklist() {
  const items: { label: string; now: boolean }[] = [
    { label: "Next.js App Router deployment — Vercel-ready build", now: true },
    { label: "PKI sealing with stateless public verification", now: true },
    { label: "Hardened security headers (vercel.json)", now: true },
    { label: "CI pipeline — lint · typecheck · build gate", now: true },
    { label: "Environment template and deployment documentation", now: true },
    { label: "Operations ledger with live audit streaming", now: true },
    { label: "Multi-tenant PostgreSQL persistence", now: false },
    { label: "HSM key custody and formal key ceremony", now: false },
    { label: "SSO, RBAC and MFA for ministry personnel", now: false },
    { label: "Live civic registry integrations (OpenTender ZA · BlackBiz)", now: false },
    { label: "SOC 2 Type II / ISO 27001 certification", now: false },
  ];
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-start gap-2.5 border border-hairline bg-card px-3.5 py-2.5"
        >
          {it.now ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verify" aria-hidden="true" />
          ) : (
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#B9B4A4]" aria-hidden="true" />
          )}
          <span className="flex-1 text-xs leading-relaxed text-ink">{it.label}</span>
          <span
            className={`shrink-0 border px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.14em] ${
              it.now
                ? "border-navy bg-navy text-[#F2EFE7]"
                : "border-gold/60 bg-gold-soft text-gold-ink"
            }`}
          >
            {it.now ? "In this build" : "Phase 2"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Architecture() {
  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Engineering dossier — from proof of concept to sovereign production"
        title="System Architecture &amp; Production Pathway"
        description="The sandbox is deliberately constructed as a vertical slice of the production platform: the same integrity mathematics, the same request lifecycle and the same operational discipline that Phase 2 scales into a sovereign deployment. This dossier sets out the topology, the security model and the exact pathway from this demonstration to production infrastructure."
      />

      {/* Topology */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            I — Production deployment topology
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            Six tiers with a cross-cutting operations plane. Requests enter
            through the edge perimeter, are served by the application tier, and
            exercise the intelligence and integrity services before touching
            state. Civic integrations bind the platform to verified South
            African and Turkish registries.
          </p>
        </div>
        <DeploymentTopology />
      </section>

      {/* Lifecycle */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            II — Anatomy of a verified communication
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            The complete lifecycle of a state bulletin, from composition to
            ledger entry. Every stage is exercised live in the{" "}
            <strong className="text-navy">Sandbox Console</strong> — scenes II
            through IV perform steps I through VII in real time.
          </p>
        </div>
        <LifecycleSection />
      </section>

      {/* Environment matrix */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            III — Environment matrix
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            What is demonstrated here versus what production adds. The sandbox
            never weakens the security model to make the demo easier — seals
            produced here are verified by exactly the same mathematics a
            ministry deployment would use.
          </p>
        </div>
        <EnvironmentMatrix />
      </section>

      {/* Security & compliance */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            IV — Security &amp; compliance model
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            Controls are mapped to the three jurisdictions of the programme —
            South Africa, Türkiye and the continental trade framework — with
            certification milestones scheduled across the roadmap phases.
          </p>
        </div>
        <SecurityCompliance />
      </section>

      {/* Pipeline */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            V — Deployment pipeline: GitHub → Vercel
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            The repository ships with its full deployment apparatus: the CI
            workflow (.github/workflows/ci.yml), hardened edge configuration
            (vercel.json) and a documented environment template (.env.example).
            Connecting the repository to Vercel is a two-click operation.
          </p>
        </div>
        <PipelineSection />
      </section>

      {/* Reliability */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            VI — Reliability &amp; disaster recovery posture
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            Objectives the production platform is engineered and operated
            against, with recovery rehearsed rather than presumed.
          </p>
        </div>
        <ReliabilitySection />
      </section>

      {/* Checklist */}
      <section>
        <div className="mb-5 border-l-2 border-gold pl-4">
          <h3 className="font-serif text-lg font-semibold text-navy">
            VII — Production readiness checklist
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-[1.8] text-ink-soft">
            The explicit delta between this build and the Phase 2 sovereign
            platform — every open item is scoped, costed and scheduled in the
            implementation roadmap.
          </p>
        </div>
        <ReadinessChecklist />
      </section>
    </div>
  );
}
