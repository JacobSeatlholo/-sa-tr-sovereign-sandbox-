import { NextResponse } from "next/server";
import { ledgerSize, listEvents } from "@/lib/store";
import { publicKeyFingerprint } from "@/lib/pki";
import { SIGNING_ALGORITHM } from "@/lib/pki";

export const dynamic = "force-dynamic";

/** GET /api/events — operations ledger (newest first) + platform telemetry. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 24), 1), 100);

  return NextResponse.json({
    events: listEvents(limit),
    ledgerSize: ledgerSize(),
    serverTime: new Date().toISOString(),
    signingAlgorithm: SIGNING_ALGORITHM,
    publicKeyFingerprint: publicKeyFingerprint(),
  });
}
