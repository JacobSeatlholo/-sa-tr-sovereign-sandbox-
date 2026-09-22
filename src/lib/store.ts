// ─────────────────────────────────────────────────────────────────────────────
// In-memory bulletin registry + sandbox counters + operations ledger.
//
// Deliberately stateless-friendly: every seal is self-verifying (SHA-256 +
// Ed25519), so verification never depends on this store. The registry is a
// convenience gallery — a serverless cold start simply re-seeds the demo
// bulletins. Phase 2 swaps this module for PostgreSQL persistence with an
// append-only audit ledger.
// ─────────────────────────────────────────────────────────────────────────────

import type { Bulletin } from "./types";
import { SEED_BULLETINS } from "./seed-data";

interface Registry {
  bulletins: Bulletin[];
  stats: {
    verificationsPerformed: number;
    policyAnalyses: number;
  };
  ledger: LedgerEvent[];
}

// Survives across hot reloads in dev and warm instances in production.
const g = globalThis as unknown as { __sandboxRegistry?: Registry };

function registry(): Registry {
  if (!g.__sandboxRegistry) {
    g.__sandboxRegistry = {
      bulletins: [...SEED_BULLETINS],
      stats: { verificationsPerformed: 0, policyAnalyses: 0 },
      ledger: [],
    };
  }
  const reg = g.__sandboxRegistry;
  // Self-heal across hot reloads / module upgrades: migrate partial shapes.
  if (!Array.isArray(reg.bulletins)) reg.bulletins = [...SEED_BULLETINS];
  if (!reg.stats || typeof reg.stats.verificationsPerformed !== "number") {
    reg.stats = { verificationsPerformed: 0, policyAnalyses: 0 };
  }
  if (!Array.isArray(reg.ledger)) reg.ledger = [];
  return reg;
}

export function listBulletins(): Bulletin[] {
  return [...registry().bulletins].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
}

export function addBulletin(b: Bulletin): void {
  registry().bulletins.push(b);
}

export function getBulletin(id: string): Bulletin | undefined {
  return registry().bulletins.find((b) => b.id === id);
}

export function incrementVerifications(): void {
  registry().stats.verificationsPerformed += 1;
}

export function incrementPolicyAnalyses(): void {
  registry().stats.policyAnalyses += 1;
}

export function sandboxCounters() {
  return { ...registry().stats };
}

// ── Operations ledger (append-only audit trail) ─────────────────────────────

export type LedgerEventType =
  | "SYSTEM"
  | "SEAL"
  | "VERIFY"
  | "VERIFY-FAIL"
  | "ANALYSIS"
  | "MATCH"
  | "CONSOLE";

export interface LedgerEvent {
  id: string;
  type: LedgerEventType;
  summary: string;
  detail?: string;
  at: string; // ISO timestamp (UTC)
}

const LEDGER_CAPACITY = 200;

/** Append an event to the operations ledger (newest last, capped). */
export function recordEvent(
  type: LedgerEventType,
  summary: string,
  detail?: string
): LedgerEvent {
  const reg = registry();
  const event: LedgerEvent = {
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    summary,
    detail,
    at: new Date().toISOString(),
  };
  reg.ledger.push(event);
  if (reg.ledger.length > LEDGER_CAPACITY) {
    reg.ledger.splice(0, reg.ledger.length - LEDGER_CAPACITY);
  }
  return event;
}

/** Newest-first slice of the operations ledger. */
export function listEvents(limit = 50): LedgerEvent[] {
  return [...registry().ledger].reverse().slice(0, Math.min(limit, LEDGER_CAPACITY));
}

export function ledgerSize(): number {
  return registry().ledger.length;
}
