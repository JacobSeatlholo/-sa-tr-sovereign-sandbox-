import { NextResponse } from "next/server";
import { listBulletins, sandboxCounters } from "@/lib/store";
import { COMPANIES } from "@/lib/seed-data";
import { publicKeyFingerprint } from "@/lib/pki";
import type { SandboxStats } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/stats — dashboard metrics for the Overview tab. */
export async function GET() {
  const counters = sandboxCounters();
  const stats: SandboxStats = {
    bulletinsSealed: listBulletins().length,
    verificationsPerformed: counters.verificationsPerformed,
    companiesListed: COMPANIES.length,
    policyAnalyses: counters.policyAnalyses,
    uptimeNote:
      "In-memory sandbox counters reset on serverless cold start; seals remain independently verifiable.",
  };

  return NextResponse.json({
    stats,
    publicKeyFingerprint: publicKeyFingerprint(),
    generatedAt: new Date().toISOString(),
  });
}
