import { NextResponse } from "next/server";
import {
  canonicalBulletin,
  publicKeyBase64,
  publicKeyFingerprint,
  sha256Hex,
  verifyCanonical,
  SIGNING_ALGORITHM,
  DIGEST_ALGORITHM,
} from "@/lib/pki";
import { incrementVerifications } from "@/lib/store";
import type { VerificationResult } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/verify — stateless integrity verification.
 * Accepts either structured bulletin fields (title/issuer/classification/body/
 * publishedAt) or a raw `canonical` string, plus the claimed hash & signature.
 * No registry access is required: the seal is self-verifying.
 */
export async function POST(req: Request) {
  let body: {
    canonical?: string;
    title?: string;
    issuer?: string;
    classification?: string;
    body?: string;
    publishedAt?: string;
    hash?: string;
    signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const hash = (body.hash ?? "").trim().toLowerCase();
  const signature = (body.signature ?? "").trim();

  if (!hash || !signature) {
    return NextResponse.json(
      { error: "Both `hash` (SHA-256 digest) and `signature` are required" },
      { status: 400 }
    );
  }
  if (!/^[a-f0-9]{64}$/.test(hash)) {
    return NextResponse.json(
      { error: "Hash must be a 64-character SHA-256 hex digest" },
      { status: 400 }
    );
  }

  let canonical = (body.canonical ?? "").trim();
  if (!canonical) {
    const { title, issuer, classification, body: content, publishedAt } = body;
    if (
      !title?.trim() ||
      !issuer?.trim() ||
      !classification?.trim() ||
      !content?.trim() ||
      !publishedAt?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Provide either `canonical` text or all of: title, issuer, classification, body, publishedAt",
        },
        { status: 400 }
      );
    }
    canonical = canonicalBulletin({
      title,
      issuer,
      classification,
      body: content,
      publishedAt,
    });
  }

  const recomputedHash = sha256Hex(canonical);
  const signatureValid = verifyCanonical(canonical, signature);
  const hashMatch = recomputedHash === hash;

  incrementVerifications();

  const result: VerificationResult = {
    authentic: hashMatch && signatureValid,
    checks: { hashMatch, signatureValid },
    message:
      hashMatch && signatureValid
        ? "AUTHENTIC — digest and Ed25519 signature both verified against the sandbox public key. This bulletin has not been altered since sealing."
        : !hashMatch && signatureValid
          ? "TAMPERED — signature is valid but the recomputed digest does not match the claimed hash. The signed content differs from what was provided."
          : hashMatch && !signatureValid
            ? "FAILED SIGNATURE — digest matches but the signature does not verify against the sandbox public key. Content may have been signed by a different key."
            : "NOT AUTHENTIC — both digest and signature checks failed. Treat this content as unverified.",
    verifiedAt: new Date().toISOString(),
    details: {
      recomputedHash,
      providedHash: hash,
      publicKeyFingerprint: publicKeyFingerprint(),
    },
  };

  return NextResponse.json({
    ...result,
    algorithm: SIGNING_ALGORITHM,
    digestAlgorithm: DIGEST_ALGORITHM,
    publicKey: publicKeyBase64(),
  });
}
