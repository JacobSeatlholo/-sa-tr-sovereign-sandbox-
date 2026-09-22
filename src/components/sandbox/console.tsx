"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Cpu,
  Loader2,
  Radio,
  ShieldCheck,
  Terminal,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./shared";
import { SAMPLE_TR_POLICY } from "@/lib/overview-content";
import type {
  Bulletin,
  Company,
  MatchResult,
  PolicyAnalysis,
  VerificationResult,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DEMONSTRATION CONSOLE
//
// Three coordinated instruments on one operations floor:
//   1. Demonstration Protocol — a five-scene guided execution of every
//      sovereign capability against the real backends.
//   2. Command Console — a privileged terminal backed by /api/console.
//   3. Operations Ledger — server-recorded audit stream (/api/events).
// ─────────────────────────────────────────────────────────────────────────────

type ConsoleLineKind = "cmd" | "out" | "ok" | "err" | "gold" | "dim";
interface ConsoleLine {
  kind: ConsoleLineKind;
  text: string;
}

type LedgerEventType =
  | "SYSTEM"
  | "SEAL"
  | "VERIFY"
  | "VERIFY-FAIL"
  | "ANALYSIS"
  | "MATCH"
  | "CONSOLE";

interface LedgerEvent {
  id: string;
  type: LedgerEventType;
  summary: string;
  detail?: string;
  at: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return (await res.json()) as T;
}

// ── Telemetry strip ───────────────────────────────────────────────────────────

function utcClock(d: Date): string {
  return `${d.toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

function TelemetryStrip({ ledgerVersion }: { ledgerVersion: number }) {
  const [fingerprint, setFingerprint] = useState("");
  const [ledgerSize, setLedgerSize] = useState<number | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    getJSON<{ serverTime: string; ledgerSize: number; publicKeyFingerprint: string }>(
      "/api/events?limit=1"
    )
      .then((d) => {
        setFingerprint(d.publicKeyFingerprint);
        setLedgerSize(d.ledgerSize);
      })
      .catch(() => undefined);
  }, [ledgerVersion]);

  useEffect(() => {
    const tick = () => setClock(utcClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cells: { label: string; value: string; mono?: boolean }[] = [
    { label: "Build", value: "Phase I · v2.0" },
    { label: "Digital seal", value: "Ed25519 · SHA-256" },
    { label: "Signing key", value: fingerprint ? `${fingerprint.slice(0, 18)}…` : "…", mono: true },
    { label: "Ledger entries", value: ledgerSize === null ? "…" : String(ledgerSize) },
    { label: "Server time", value: clock || "…", mono: true },
  ];

  return (
    <div className="engraved border border-navy-line bg-navy-deep">
      <div className="grid grid-cols-2 divide-navy-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
        {cells.map((c) => (
          <div key={c.label} className="border-b border-navy-line px-4 py-2.5 lg:border-b-0">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#7E8FA3]">
              {c.label}
            </p>
            <p
              className={`mt-1 truncate text-[12px] font-semibold text-[#E8E4D8] ${
                c.mono ? "font-mono tracking-tight" : ""
              }`}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Demonstration protocol ────────────────────────────────────────────────────

type SceneResult =
  | { type: "policy"; analysis: PolicyAnalysis; degraded: boolean; ms: number }
  | { type: "seal"; bulletin: Bulletin }
  | { type: "verify"; verdict: VerificationResult }
  | { type: "tamper"; verdict: VerificationResult }
  | { type: "match"; matches: MatchResult[]; source: Company | null }
  | { type: "error"; message: string };

interface SceneState {
  status: "pending" | "running" | "done" | "error";
  stepIdx: number;
  result: SceneResult | null;
}

interface SceneDef {
  numeral: string;
  title: string;
  capability: string;
  steps: string[];
}

const SCENES: SceneDef[] = [
  {
    numeral: "I",
    title: "Policy Intelligence",
    capability: "Diplomatic Policy Indexer",
    steps: [
      "Transmitting the official bilateral policy text to the analysis pipeline",
      "Extracting translation, structured commitments and policy domains",
      "Compiling the structured bilateral policy index",
    ],
  },
  {
    numeral: "II",
    title: "Sealing a State Communiqué",
    capability: "Information Integrity Engine",
    steps: [
      "Composing the joint bilateral communiqué",
      "Computing the SHA-256 digest over the canonical bulletin",
      "Affixing the Ed25519 digital seal",
      "Registering the sealed bulletin in the state registry",
    ],
  },
  {
    numeral: "III",
    title: "Authenticity Verification",
    capability: "Stateless PKI verification",
    steps: [
      "Reconstructing the canonical bulletin bytes",
      "Recomputing the SHA-256 digest",
      "Validating the Ed25519 signature against the official public key",
    ],
  },
  {
    numeral: "IV",
    title: "Adversarial Tamper Drill",
    capability: "Forgery detection exercise",
    steps: [
      "Injecting a fabricated annex into the bulletin body",
      "Re-attempting verification of the altered content",
      "Confirming cryptographic detection and rejection",
    ],
  },
  {
    numeral: "V",
    title: "Trade Matchmaking",
    capability: "Cross-Border Trade Engine",
    steps: [
      "Submitting the procurement requirement",
      "Scoring counterparties — TF-IDF cosine similarity",
      "Ranking AfCFTA-aligned matches",
    ],
  },
];

function initScenes(): SceneState[] {
  return SCENES.map(() => ({ status: "pending", stepIdx: 0, result: null }));
}

const communiquéBody = () =>
  `The Joint Bilateral Engine confirms operational readiness of the Sovereign AI & Digital Trade Sandbox. This communiqué is sealed at ${new Date().toISOString()} under the Phase I demonstration protocol for verification by authorised observers.`;

function StepRow({
  text,
  state,
}: {
  text: string;
  state: "pending" | "active" | "done";
}) {
  return (
    <li className="flex items-start gap-2.5">
      {state === "done" ? (
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verify" aria-hidden="true" />
      ) : state === "active" ? (
        <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-gold" aria-hidden="true" />
      ) : (
        <CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B9B4A4]" aria-hidden="true" />
      )}
      <span
        className={`text-xs leading-relaxed ${
          state === "pending" ? "text-ink-soft/70" : "text-ink"
        }`}
      >
        {text}
      </span>
    </li>
  );
}

function SceneResultPanel({ result }: { result: SceneResult }) {
  if (result.type === "error") {
    return (
      <div className="border border-alert/40 bg-alert-soft/50 px-4 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-alert">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          {result.message}
        </p>
      </div>
    );
  }

  if (result.type === "policy") {
    const a = result.analysis;
    return (
      <div className="space-y-2.5 border border-hairline bg-paper px-4 py-3.5">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-gold-ink">
          Structured index — {result.ms}ms {result.degraded ? "· degraded" : ""}
        </p>
        <p className="text-xs leading-relaxed text-ink">{a.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {a.domains.map((d) => (
            <span
              key={d}
              className="border border-navy/25 bg-[#EDF1F5] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-navy"
            >
              {d}
            </span>
          ))}
        </div>
        <p className="text-[11px] font-semibold text-navy">
          {a.commitments.length} structured commitments · {a.riskFlags.length} risk flags
        </p>
        {a.riskFlags.slice(0, 2).map((r) => (
          <p key={r} className="text-[11px] font-medium leading-snug text-alert">
            ⚠ {r}
          </p>
        ))}
      </div>
    );
  }

  if (result.type === "seal") {
    return (
      <div className="space-y-1.5 border border-hairline bg-paper px-4 py-3.5 font-mono text-[11px] leading-relaxed">
        <p className="font-sans text-[9.5px] font-bold uppercase tracking-[0.18em] text-gold-ink">
          Sealed &amp; registered — {result.bulletin.id}
        </p>
        <p className="break-all text-ink">
          <span className="text-gold-ink">sha-256 </span>
          {result.bulletin.seal.hash}
        </p>
        <p className="break-all text-ink-soft">
          <span className="text-gold-ink">ed25519 </span>
          {result.bulletin.seal.signature.slice(0, 72)}…
        </p>
      </div>
    );
  }

  if (result.type === "verify" || result.type === "tamper") {
    const v = result.verdict;
    const authentic = result.type === "verify" && v.authentic;
    const detected = result.type === "tamper" && !v.authentic;
    const good = authentic || detected;
    return (
      <div
        className={`space-y-1.5 border px-4 py-3.5 font-mono text-[11px] leading-relaxed ${
          good ? "border-verify/40 bg-verify-soft/40" : "border-alert/40 bg-alert-soft/40"
        }`}
      >
        <p
          className={`flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] ${
            good ? "text-verify" : "text-alert"
          }`}
        >
          {good ? (
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {authentic
            ? "Verdict: authentic"
            : detected
              ? "Verdict: tamper detected"
              : "Verdict: not authentic"}
        </p>
        <p className={good ? "text-ink" : "text-ink"}>
          digest match <span className="font-bold">{v.checks.hashMatch ? "MATCH" : "MISMATCH"}</span>
          <span className="mx-2 text-hairline">|</span>
          signature <span className="font-bold">{v.checks.signatureValid ? "VALID" : "INVALID"}</span>
        </p>
      </div>
    );
  }

  // match
  return (
    <div className="space-y-1.5 border border-hairline bg-paper px-4 py-3.5">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-gold-ink">
        Ranked counterparties
      </p>
      {result.matches.slice(0, 3).map((m, i) => (
        <p key={m.company.id} className="flex items-baseline gap-2 text-xs text-ink">
          <span className="font-mono text-[11px] text-gold-ink">{String(i + 1).padStart(2)}</span>
          <span className="font-mono text-[11px] font-bold text-navy">{m.score}%</span>
          <span className="font-semibold">{m.company.name}</span>
          <span className="text-ink-soft">
            · {m.company.countryName} · {m.company.city}
          </span>
        </p>
      ))}
      {result.matches.length === 0 ? (
        <p className="text-xs text-ink-soft">No counterparties matched for this query.</p>
      ) : null}
    </div>
  );
}

function ProtocolPanel({
  onActivity,
}: {
  onActivity: () => void;
}) {
  const [scenes, setScenes] = useState<SceneState[]>(initScenes);
  const [running, setRunning] = useState(false);
  const bulletinRef = useRef<Bulletin | null>(null);
  const runIdRef = useRef(0);

  const patchScene = useCallback(
    (idx: number, patch: Partial<SceneState>) => {
      setScenes((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const executeScene = async (idx: number): Promise<SceneResult> => {
    switch (idx) {
      case 0: {
        const d = await postJSON<{ data: PolicyAnalysis; degraded: boolean; meta: { processingMs: number } }>(
          "/api/policy/analyze",
          { text: SAMPLE_TR_POLICY, direction: "TR-EN" }
        );
        return {
          type: "policy",
          analysis: d.data,
          degraded: Boolean(d.degraded),
          ms: d.meta?.processingMs ?? 0,
        };
      }
      case 1: {
        const d = await postJSON<{ bulletin: Bulletin }>("/api/bulletins", {
          title: "Joint Bilateral Communiqué — Demonstration Protocol",
          issuer: "Directorate of Communications · Joint Secretariat",
          classification: "OFFICIAL",
          body: communiquéBody(),
        });
        bulletinRef.current = d.bulletin;
        return { type: "seal", bulletin: d.bulletin };
      }
      case 2: {
        const b = bulletinRef.current;
        if (!b) throw new Error("No sealed bulletin available — run Scene II first.");
        const verdict = await postJSON<VerificationResult>("/api/verify", {
          title: b.title,
          issuer: b.issuer,
          classification: b.classification,
          body: b.body,
          publishedAt: b.publishedAt,
          hash: b.seal.hash,
          signature: b.seal.signature,
        });
        return { type: "verify", verdict };
      }
      case 3: {
        const b = bulletinRef.current;
        if (!b) throw new Error("No sealed bulletin available — run Scene II first.");
        const verdict = await postJSON<VerificationResult>("/api/verify", {
          title: b.title,
          issuer: b.issuer,
          classification: b.classification,
          body: `${b.body}\n[UNAUTHORISED EDIT — fabricated annex inserted]`,
          publishedAt: b.publishedAt,
          hash: b.seal.hash,
          signature: b.seal.signature,
        });
        return { type: "tamper", verdict };
      }
      default: {
        const d = await postJSON<{ matches: MatchResult[]; source: Company | null }>(
          "/api/trade/match",
          { query: "solar panel components renewable energy procurement", limit: 5 }
        );
        return { type: "match", matches: d.matches, source: d.source };
      }
    }
  };

  const runScene = async (idx: number): Promise<boolean> => {
    patchScene(idx, { status: "running", stepIdx: 0, result: null });
    const execution = executeScene(idx).catch(
      (err: Error): SceneResult => ({ type: "error", message: err.message })
    );
    const stepCount = SCENES[idx].steps.length;
    for (let s = 1; s < stepCount; s++) {
      await sleep(640);
      patchScene(idx, { stepIdx: s });
    }
    await sleep(240);
    const result = await execution;
    const failed = result.type === "error";
    patchScene(idx, { status: failed ? "error" : "done", result });
    onActivity();
    if (!failed) {
      if (result.type === "seal") toast.success(`Communiqué sealed — ${result.bulletin.id}`);
      if (result.type === "verify" && result.verdict.authentic) toast.success("Cryptographic seal verified — authentic.");
      if (result.type === "tamper" && !result.verdict.authentic) toast.warning("Tampering detected and rejected by the seal.");
      if (result.type === "match") toast.success(`${result.matches.length} counterparties ranked.`);
    } else if (result.type === "error") {
      toast.error(result.message);
    }
    return !failed;
  };

  const runProtocol = async () => {
    if (running) return;
    setRunning(true);
    const runId = ++runIdRef.current;
    setScenes(initScenes());
    await sleep(350);
    for (let i = 0; i < SCENES.length; i++) {
      if (runIdRef.current !== runId) return; // reset pressed mid-run
      const ok = await runScene(i);
      if (!ok) break;
      await sleep(420);
    }
    setRunning(false);
  };

  const reset = () => {
    runIdRef.current++;
    setRunning(false);
    setScenes(initScenes());
    bulletinRef.current = null;
  };

  const doneCount = scenes.filter((s) => s.status === "done").length;
  const activeIdx = scenes.findIndex((s) => s.status === "running");

  return (
    <Card className="border-hairline bg-card">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.22em] text-gold-ink">
              <Radio className="h-3.5 w-3.5" aria-hidden="true" />
              Demonstration protocol — joint bilateral capabilities
            </p>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-ink-soft">
              Five scripted scenes execute the platform&rsquo;s real pipelines end-to-end —
              policy analysis, cryptographic sealing, stateless verification,
              adversarial detection and trade matchmaking. No simulated outputs.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              onClick={runProtocol}
              disabled={running}
              className="bg-gold px-4 font-bold uppercase tracking-[0.12em] text-navy-deep hover:bg-gold-bright"
            >
              {running ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Scene {SCENES[Math.max(activeIdx, 0)].numeral} of V
                </>
              ) : (
                <>
                  <ChevronRight className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Execute protocol
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={reset}
              disabled={running}
              className="font-semibold uppercase tracking-[0.12em]"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-paper">
            <div
              className="h-full bg-gold transition-all duration-700"
              style={{ width: `${(doneCount / SCENES.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            {doneCount} / {SCENES.length} complete
          </span>
        </div>

        <ol className="mt-5 space-y-3">
          {SCENES.map((scene, i) => {
            const st = scenes[i];
            return (
              <li
                key={scene.numeral}
                className={`border ${
                  st.status === "running"
                    ? "border-gold/60 shadow-[inset_2px_0_0_0_#b08d3e]"
                    : st.status === "done"
                      ? "border-hairline"
                      : st.status === "error"
                        ? "border-alert/40"
                        : "border-hairline bg-paper/40"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center font-serif text-[13px] font-semibold ${
                      st.status === "running"
                        ? "bg-gold text-navy-deep"
                        : st.status === "done"
                          ? "bg-navy text-[#F2EFE7]"
                          : st.status === "error"
                            ? "bg-alert text-[#F2EFE7]"
                            : "border border-hairline bg-white text-ink-soft"
                    }`}
                  >
                    {scene.numeral}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{scene.title}</p>
                    <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                      {scene.capability}
                    </p>
                  </div>
                  {st.status === "running" ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-gold-ink">
                      <span className="h-1.5 w-1.5 animate-pulse bg-gold" aria-hidden="true" />
                      Executing
                    </span>
                  ) : st.status === "done" ? (
                    <span className="flex shrink-0 items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-verify">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Complete
                    </span>
                  ) : st.status === "error" ? (
                    <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-[0.16em] text-alert">
                      Interrupted
                    </span>
                  ) : (
                    <button
                      onClick={() => runScene(i)}
                      disabled={running}
                      className="shrink-0 text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-navy disabled:opacity-40"
                    >
                      Run scene
                    </button>
                  )}
                </div>

                {st.status !== "pending" ? (
                  <div className="border-t border-hairline px-4 py-3">
                    <ul className="space-y-1.5">
                      {scene.steps.map((step, s) => (
                        <StepRow
                          key={step}
                          text={step}
                          state={
                            st.status === "done" || st.status === "error"
                              ? "done"
                              : s < st.stepIdx
                                ? "done"
                                : s === st.stepIdx
                                  ? "active"
                                  : "pending"
                          }
                        />
                      ))}
                    </ul>
                    {st.status !== "running" && st.result ? (
                      <div className="mt-3">
                        <SceneResultPanel result={st.result} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

// ── Command console ───────────────────────────────────────────────────────────

const WELCOME: ConsoleLine[] = [
  { kind: "gold", text: "SOVEREIGN AI & DIGITAL TRADE SANDBOX — COMMAND CONSOLE" },
  { kind: "out", text: "Authorised demonstration session. Commands execute against the" },
  { kind: "out", text: "live platform backends. Type  help  for the command index." },
];

const LINE_STYLE: Record<ConsoleLineKind, string> = {
  cmd: "text-[#E8E4D8]",
  out: "text-[#AEBBCC]",
  ok: "text-[#7FC9A6]",
  err: "text-[#E08585]",
  gold: "text-gold-bright font-semibold",
  dim: "text-[#64788E]",
};

const QUICK_COMMANDS = ["help", "status", "keyinfo", "list", "events"];

function ConsoleTerminal({ onActivity }: { onActivity: () => void }) {
  const [lines, setLines] = useState<ConsoleLine[]>(WELCOME);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, executing]);

  const exec = async (raw: string) => {
    const command = raw.trim();
    if (!command || executing) return;
    setHistory((h) => [command, ...h].slice(0, 40));
    setHistoryIdx(-1);
    setLines((prev) => [...prev, { kind: "cmd", text: command }]);
    setInput("");

    if (command.toLowerCase() === "clear") {
      setLines(WELCOME);
      return;
    }

    setExecuting(true);
    try {
      const data = await postJSON<{ lines: ConsoleLine[] }>("/api/console", { command });
      setLines((prev) => [...prev, ...data.lines]);
      onActivity();
    } catch {
      setLines((prev) => [
        ...prev,
        { kind: "err", text: "Console link failure — please retry." },
      ]);
    } finally {
      setExecuting(false);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void exec(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInput("");
        return;
      }
      const next = historyIdx - 1;
      setHistoryIdx(next);
      setInput(history[next]);
    }
  };

  return (
    <div className="flex h-full flex-col border border-navy-line bg-navy-deep">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between border-b border-navy-line bg-navy px-4 py-2.5">
        <p className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.22em] text-gold-bright">
          <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
          Command console
        </p>
        <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#7E8FA3]">
          {executing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              Executing
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 bg-[#7FC9A6]" aria-hidden="true" />
              Session authorised
            </>
          )}
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="scroll-elegant max-h-[380px] min-h-[280px] flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.7] lg:max-h-[520px]"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${LINE_STYLE[l.kind]}`}>
            {l.kind === "cmd" ? (
              <>
                <span className="select-none text-gold-bright">console» </span>
                {l.text}
              </>
            ) : (
              l.text
            )}
          </p>
        ))}
        {executing ? (
          <p className="animate-pulse text-[#64788E]">▌ working…</p>
        ) : null}
      </div>

      {/* Quick commands */}
      <div className="flex flex-wrap gap-1.5 border-t border-navy-line bg-navy px-3 py-2">
        {QUICK_COMMANDS.map((c) => (
          <button
            key={c}
            onClick={() => exec(c)}
            disabled={executing}
            className="border border-navy-line px-2 py-1 font-mono text-[10.5px] text-[#AEBBCC] transition-colors hover:border-gold hover:text-gold-bright disabled:opacity-40"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 border-t border-navy-line bg-navy-deep px-4 py-3">
        <span className="shrink-0 select-none font-mono text-[12px] font-semibold text-gold-bright">
          console»
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={executing}
          spellCheck={false}
          autoComplete="off"
          aria-label="Console command input"
          placeholder="enter command…"
          className="w-full bg-transparent font-mono text-[12.5px] text-[#E8E4D8] caret-[#C9A961] outline-none placeholder:text-[#51637A] disabled:opacity-50"
        />
      </div>
    </div>
  );
}

// ── Operations ledger ─────────────────────────────────────────────────────────

const EVENT_STYLE: Record<LedgerEventType, string> = {
  SYSTEM: "border-[#9AA3AE] text-[#3D4650] bg-[#F1F2F0]",
  SEAL: "border-gold/60 text-gold-ink bg-gold-soft",
  VERIFY: "border-verify/50 text-verify bg-verify-soft",
  "VERIFY-FAIL": "border-alert/50 text-alert bg-alert-soft",
  ANALYSIS: "border-navy/30 text-navy bg-[#EDF1F5]",
  MATCH: "border-navy/30 text-navy bg-[#EDF1F5]",
  CONSOLE: "border-[#9AA3AE] text-[#3D4650] bg-[#F1F2F0]",
};

function LedgerPanel({ refreshKey }: { refreshKey: number }) {
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await getJSON<{ events: LedgerEvent[] }>("/api/events?limit=14");
      setEvents(d.events);
    } catch {
      // ledger is non-critical — silent retry on next interval
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <Card className="border-hairline bg-card">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.22em] text-gold-ink">
            <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
            Operations ledger — live audit stream
          </p>
          <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-verify opacity-60" aria-hidden="true" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-verify" aria-hidden="true" />
            </span>
            Streaming · refresh 8s
          </span>
        </div>

        <div className="scroll-elegant mt-4 max-h-72 overflow-auto border border-hairline">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-paper">
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                  Time (UTC)
                </th>
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                  Class
                </th>
                <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                  Entry
                </th>
              </tr>
            </thead>
            <tbody>
              {!loaded ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-xs text-ink-soft">
                    Connecting to ledger…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-xs text-ink-soft">
                    Ledger is empty — execute the protocol or a console command.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="border-b border-hairline/70 last:border-0">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[10.5px] text-ink-soft">
                      {e.at.replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block border px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.14em] ${EVENT_STYLE[e.type]}`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs leading-snug text-ink">
                      {e.summary}
                      {e.detail ? (
                        <span className="block font-mono text-[10px] text-ink-soft/80">
                          {e.detail}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">
          Every sealing, verification, analysis, match and console action is
          recorded server-side. In production this stream persists to an
          append-only audit ledger (see <strong className="text-navy">Architecture</strong>).
        </p>
      </CardContent>
    </Card>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function SandboxConsole() {
  const [ledgerVersion, setLedgerVersion] = useState(0);
  const bumpLedger = useCallback(() => setLedgerVersion((v) => v + 1), []);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Operations floor — sovereign capabilities under observation"
        title="Live Demonstration Console"
        description="A single operations floor for observing the platform's sovereign capabilities: run the five-scene demonstration protocol, command the platform directly through the privileged console, and observe every action as it is written to the operations ledger."
      />

      <TelemetryStrip ledgerVersion={ledgerVersion} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProtocolPanel onActivity={bumpLedger} />
        </div>
        <div className="lg:col-span-2">
          <ConsoleTerminal onActivity={bumpLedger} />
        </div>
      </div>

      <LedgerPanel refreshKey={ledgerVersion} />
    </div>
  );
}
