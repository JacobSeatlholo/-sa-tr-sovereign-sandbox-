// ─────────────────────────────────────────────────────────────────────────────
// In-memory bulletin registry + sandbox counters.
//
// Deliberately stateless-friendly: every seal is self-verifying (SHA-256 +
// Ed25519), so verification never depends on this store. The registry is a
// convenience gallery — a serverless cold start simply re-seeds the demo
// bulletins. Phase 2 swaps this module for PostgreSQL persistence.
// ─────────────────────────────────────────────────────────────────────────────

import type { Bulletin } from "./types";
import { SEED_BULLETINS } from "./seed-data";

interface Registry {
  bulletins: Bulletin[];
  stats: {
    verificationsPerformed: number;
    policyAnalyses: number;
  };
}

// Survives across hot reloads in dev and warm instances in production.
const g = globalThis as unknown as { __sandboxRegistry?: Registry };

function registry(): Registry {
  if (!g.__sandboxRegistry) {
    g.__sandboxRegistry = {
      bulletins: [...SEED_BULLETINS],
      stats: { verificationsPerformed: 0, policyAnalyses: 0 },
    };
  }
  return g.__sandboxRegistry;
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
