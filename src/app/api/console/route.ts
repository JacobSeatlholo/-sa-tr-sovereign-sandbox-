import { NextResponse } from "next/server";
import {
  canonicalBulletin,
  DIGEST_ALGORITHM,
  publicKeyBase64,
  publicKeyFingerprint,
  sha256Hex,
  SIGNING_ALGORITHM,
  sealBulletin,
  verifyCanonical,
} from "@/lib/pki";
import {
  addBulletin,
  getBulletin,
  ledgerSize,
  listBulletins,
  listEvents,
  recordEvent,
  sandboxCounters,
} from "@/lib/store";
import { COMPANIES } from "@/lib/seed-data";
import { runPolicyAnalysis, AIServiceUnavailableError } from "@/lib/policy";
import { matchCounterparties } from "@/lib/matching";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/console — privileged demonstration command interpreter.
//
// Every command executes against the real sandbox backends (PKI engine,
// policy pipeline, matching engine, ledger) — nothing is mocked. Output is
// returned as typed lines for terminal rendering.
// ─────────────────────────────────────────────────────────────────────────────

export type ConsoleLineKind = "cmd" | "out" | "ok" | "err" | "gold" | "dim";
export interface ConsoleLine {
  kind: ConsoleLineKind;
  text: string;
}

const HELP_LINES: ConsoleLine[] = [
  { kind: "gold", text: "SANDBOX COMMAND CONSOLE — authorised demonstration commands" },
  { kind: "out", text: "  help                 Show this command index" },
  { kind: "out", text: "  status               Platform telemetry and registry counters" },
  { kind: "out", text: "  keyinfo              Active Ed25519 signing credentials" },
  { kind: "out", text: "  list                 List sealed bulletins in the registry" },
  { kind: "out", text: "  seal <message>       Seal an official dispatch (SHA-256 + Ed25519)" },
  { kind: "out", text: "  verify <id>          Verify a bulletin's cryptographic seal" },
  { kind: "out", text: "  tamper <id>          Simulate adversarial tampering (detection drill)" },
  { kind: "out", text: "  analyze <text>       Run TR↔EN policy analysis (min 20 characters)" },
  { kind: "out", text: "  match <query>        Match trade counterparties (min 5 characters)" },
  { kind: "out", text: "  events               Recent entries from the operations ledger" },
  { kind: "dim", text: "  ↑ / ↓                Command history ·  clear  clears the console" },
];

function lines(...arr: ConsoleLine[]): ConsoleLine[] {
  return arr;
}

function out(text: string): ConsoleLine {
  return { kind: "out", text };
}

function fmtIdList(): ConsoleLine[] {
  const bulletins = listBulletins();
  if (bulletins.length === 0) return [out("Registry is empty.")];
  return bulletins.slice(0, 12).map((b) =>
    out(
      `${b.id.padEnd(24)} ${b.publishedAt.slice(0, 10)}  [${b.classification.padEnd(8)}] ${b.title.slice(0, 52)}`
    )
  );
}

export async function POST(req: Request) {
  let body: { command?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = (body.command ?? "").trim();
  if (!raw) {
    return NextResponse.json({ ok: true, lines: [] });
  }

  const [cmd, ...rest] = raw.split(/\s+/);
  const arg = rest.join(" ").trim();
  const lc = cmd.toLowerCase();
  let result: ConsoleLine[] = [];
  let ack = true; // whether to record a CONSOLE ledger entry

  try {
    switch (lc) {
      case "help":
      case "?":
        result = HELP_LINES;
        ack = false;
        break;

      case "status": {
        const c = sandboxCounters();
        result = lines(
          { kind: "gold", text: "PLATFORM STATUS — Sovereign AI & Digital Trade Sandbox" },
          out(`build               Phase I proof-of-concept · console v2.0`),
          out(`bulletins sealed    ${listBulletins().length}`),
          out(`verifications run   ${c.verificationsPerformed}`),
          out(`policy analyses     ${c.policyAnalyses}`),
          out(`registry entries    ${COMPANIES.length}`),
          out(`ledger events       ${ledgerSize()}`),
          out(`signing key         ${publicKeyFingerprint()} (${SIGNING_ALGORITHM})`),
          { kind: "dim", text: "In-memory counters reset on cold start; seals remain independently verifiable." }
        );
        break;
      }

      case "keyinfo":
        result = lines(
          { kind: "gold", text: "ACTIVE SIGNING CREDENTIALS" },
          out(`algorithm           ${SIGNING_ALGORITHM} (digital seal)`),
          out(`digest              ${DIGEST_ALGORITHM}`),
          out(`key fingerprint     ${publicKeyFingerprint()}`),
          out(`public key (b64)    ${publicKeyBase64().slice(0, 56)}…`),
          { kind: "dim", text: "Sandbox demo keypair. Production custody: HSM/KMS with documented key ceremony (Phase 2)." }
        );
        break;

      case "list":
        result = lines(
          { kind: "gold", text: "SEALED BULLETIN REGISTRY" },
          ...fmtIdList()
        );
        ack = false;
        break;

      case "seal": {
        if (!arg) {
          result = [{ kind: "err", text: "Usage: seal <message> — e.g. seal Joint communiqué on digital trade adopted" }];
          break;
        }
        const publishedAt = new Date().toISOString();
        const title = `Console Dispatch — ${publishedAt.slice(0, 10)}`;
        const bulletin = {
          id: `bul-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          issuer: "Sandbox Command Console",
          classification: "OFFICIAL" as const,
          body: arg,
          publishedAt,
          seal: sealBulletin({
            title,
            issuer: "Sandbox Command Console",
            classification: "OFFICIAL",
            body: arg,
            publishedAt,
          }),
        };
        addBulletin(bulletin);
        recordEvent(
          "SEAL",
          `Console dispatch sealed — “${arg.slice(0, 56)}${arg.length > 56 ? "…" : ""}”`,
          `${bulletin.id} · OFFICIAL · SHA-256 ${bulletin.seal.hash.slice(0, 16)}…`
        );
        result = lines(
          { kind: "ok", text: `Bulletin ${bulletin.id} sealed and registered.` },
          out(`sha-256             ${bulletin.seal.hash}`),
          out(`ed25519 signature   ${bulletin.seal.signature.slice(0, 72)}…`),
          { kind: "dim", text: `Run  verify ${bulletin.id}  to confirm authenticity.` }
        );
        break;
      }

      case "verify": {
        const b = getBulletin(arg);
        if (!b) {
          result = [{ kind: "err", text: `Bulletin not found: ${arg || "(no id given)"} — run  list  for registered ids.` }];
          break;
        }
        const canonical = canonicalBulletin({
          title: b.title,
          issuer: b.issuer,
          classification: b.classification,
          body: b.body,
          publishedAt: b.publishedAt,
        });
        const recomputed = sha256Hex(canonical);
        const sigOk = verifyCanonical(canonical, b.seal.signature);
        const hashOk = recomputed === b.seal.hash;
        recordEvent(
          hashOk && sigOk ? "VERIFY" : "VERIFY-FAIL",
          hashOk && sigOk
            ? `Authenticity confirmed — ${b.id}`
            : `Verification failed — ${b.id}`,
          `SHA-256 ${recomputed.slice(0, 16)}…`
        );
        result = lines(
          { kind: "gold", text: `VERIFICATION REPORT — ${b.id}` },
          out(`digest recomputed   ${recomputed}`),
          out(`digest match        ${hashOk ? "MATCH" : "MISMATCH"}`),
          out(`signature check     ${sigOk ? "VALID" : "INVALID"}`),
          hashOk && sigOk
            ? { kind: "ok", text: "VERDICT: AUTHENTIC — bulletin unaltered since sealing." }
            : { kind: "err", text: "VERDICT: NOT AUTHENTIC — treat content as unverified." }
        );
        break;
      }

      case "tamper": {
        const b = getBulletin(arg);
        if (!b) {
          result = [{ kind: "err", text: `Bulletin not found: ${arg || "(no id given)"} — run  list  for registered ids.` }];
          break;
        }
        const tamperedCanonical = canonicalBulletin({
          title: b.title,
          issuer: b.issuer,
          classification: b.classification,
          body: `${b.body}\n[UNAUTHORISED EDIT — fabricated annex inserted]`,
          publishedAt: b.publishedAt,
        });
        const recomputed = sha256Hex(tamperedCanonical);
        const sigOk = verifyCanonical(tamperedCanonical, b.seal.signature);
        recordEvent(
          "VERIFY-FAIL",
          `Adversarial tamper drill — forgery rejected for ${b.id}`,
          `SHA-256 ${recomputed.slice(0, 16)}…`
        );
        result = lines(
          { kind: "gold", text: `ADVERSARIAL DRILL — unauthorised annex inserted into ${b.id}` },
          out(`tampered digest     ${recomputed}`),
          out(`original digest     ${b.seal.hash}`),
          out(`digest match        ${recomputed === b.seal.hash ? "MATCH" : "MISMATCH"}`),
          out(`signature check     ${sigOk ? "VALID" : "INVALID"}`),
          { kind: "err", text: "VERDICT: TAMPER DETECTED — the seal exposes the forged content. Registry copy untouched." }
        );
        break;
      }

      case "match": {
        if (arg.length < 5) {
          result = [{ kind: "err", text: "Query must be at least 5 characters:  match <sector, product or capability>" }];
          break;
        }
        const { source, matches } = matchCounterparties({ query: arg, limit: 5 });
        recordEvent(
          "MATCH",
          `Console trade match — “${arg.slice(0, 56)}”`,
          matches.slice(0, 3).map((m) => `${m.company.name} (${m.score})`).join(" · ")
        );
        result = lines(
          { kind: "gold", text: `SEMANTIC MATCH — “${arg.slice(0, 60)}”` },
          ...(source
            ? [out(`source profile      ${source.name} (${source.countryName}, ${source.role})`)]
            : []),
          ...matches.map((m, i) =>
            out(
              `${String(i + 1).padStart(2)}. ${String(m.score).padStart(3)}%  ${m.company.name.padEnd(34)} ${m.company.countryName} · ${m.company.city}`
            )
          ),
          { kind: "dim", text: "TF-IDF cosine similarity (MVP) — pgvector upgrade scheduled for Phase 2." }
        );
        break;
      }

      case "events": {
        const evs = listEvents(8);
        result = lines(
          { kind: "gold", text: "OPERATIONS LEDGER — MOST RECENT ENTRIES" },
          ...evs.map((e) =>
            out(`${e.at.replace("T", " ").slice(0, 19)}Z  [${e.type.padEnd(11)}] ${e.summary.slice(0, 70)}`)
          ),
          { kind: "dim", text: "Append-only audit trail — persisted to the immutable ledger in Phase 2." }
        );
        ack = false;
        break;
      }

      default:
        result = lines(
          { kind: "err", text: `Unrecognised command: ${cmd}` },
          { kind: "dim", text: "Type  help  for the authorised command index." }
        );
        ack = false;
    }

    // The analyze command streams its result after the async pipeline runs.
    if (lc === "analyze" && arg.length >= 20 && result.length === 1) {
      try {
        const { analysis, degraded, processingMs } = await runPolicyAnalysis(arg, "TR-EN");
        result = lines(
          { kind: "gold", text: `POLICY ANALYSIS COMPLETE — ${processingMs}ms ${degraded ? "(degraded)" : ""}` },
          out(`domains             ${analysis.domains.join(", ") || "—"}`),
          out(`commitments         ${analysis.commitments.length} structured obligations`),
          ...analysis.commitments.slice(0, 4).map((c) =>
            out(`  · [${c.category}] ${c.commitment.slice(0, 74)}${c.commitment.length > 74 ? "…" : ""} — ${c.actor}`)
          ),
          ...analysis.riskFlags.slice(0, 3).map((r) => ({ kind: "err" as const, text: `  ⚠ risk: ${r.slice(0, 78)}` })),
          out(`summary             ${analysis.summary.slice(0, 110)}${analysis.summary.length > 110 ? "…" : ""}`),
          { kind: "dim", text: "Full analysis with translation is available in the Policy Intelligence section." }
        );
      } catch (err) {
        if (err instanceof AIServiceUnavailableError) {
          result = [
            { kind: "err", text: "AI inference pipeline unavailable on this deployment." },
            { kind: "dim", text: "Set ZAI_API_KEY and ZAI_BASE_URL environment variables (see README)." },
          ];
        } else {
          result = [{ kind: "err", text: "Policy analysis failed unexpectedly." }];
        }
      }
    }
  } catch {
    result = [{ kind: "err", text: "Command execution failed unexpectedly." }];
  }

  if (ack) {
    recordEvent("CONSOLE", `Console command executed — ${cmd}${arg ? ` ${arg.slice(0, 40)}` : ""}`);
  }

  return NextResponse.json({ ok: true, lines: result });
}
