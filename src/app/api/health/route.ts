import { NextResponse } from "next/server";
import { publicKeyBase64, publicKeyFingerprint, SIGNING_ALGORITHM, DIGEST_ALGORITHM } from "@/lib/pki";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "SA–Türkiye Sovereign AI & Digital Trade Sandbox",
    phase: "Phase 1 Proof-of-Concept",
    integrityEngine: {
      algorithm: SIGNING_ALGORITHM,
      digest: DIGEST_ALGORITHM,
      publicKeyFingerprint: publicKeyFingerprint(),
      publicKey: publicKeyBase64(),
    },
    timestamp: new Date().toISOString(),
  });
}
