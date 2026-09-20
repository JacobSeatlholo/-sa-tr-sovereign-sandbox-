// ─────────────────────────────────────────────────────────────────────────────
// Information Integrity Engine — SHA-256 digest hashing + Ed25519 PKI signing
//
// Proposal reference (Pillar 1): "A sovereign SHA-256 digest hashing and Public
// Key Infrastructure (PKI) signing module. Every official press release or
// bulletin gets a digital seal, allowing media and citizens to instantly verify
// authentic state communications against AI deepfakes."
//
// MVP key management:
//   • Production/HSM keys → set SANDBOX_PRIVATE_KEY + SANDBOX_PUBLIC_KEY env
//     vars (base64 PKCS#8 private / base64 SPKI public).
//   • Sandbox demo keys → deterministic embedded keypair (CLEARLY marked as
//     demo material; rotate before any real-world use).
// ─────────────────────────────────────────────────────────────────────────────

import {
  createHash,
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  sign as cryptoSign,
  verify as cryptoVerify,
  KeyObject,
} from "crypto";

// Demo keypair for the Phase 1 sandbox. This is intentionally committed so the
// verification flow works identically on Vercel, locally, and in CI without
// any configuration. Replace via env vars for production use.
const DEMO_PRIVATE_KEY_B64 =
  "MC4CAQAwBQYDK2VwBCIEICv3iNiGEu2ii0meUFdWUt8IIBpj4lm+WcmGURSJqnIt";

const DEMO_PUBLIC_KEY_B64 =
  "MCowBQYDK2VwAyEAvoD5CSz7+PiOTngw0e8lUbPDyupn/zZ5rWdlnAekoqg=";

export const SIGNING_ALGORITHM = "Ed25519";
export const DIGEST_ALGORITHM = "SHA-256";

let cachedPrivateKey: KeyObject | null = null;
let cachedPublicKey: KeyObject | null = null;

function pemFromDerBase64(material: string, label: "PRIVATE KEY" | "PUBLIC KEY"): string {
  const clean = material.replace(/\s+/g, "");
  const body = (clean.match(/.{1,64}/g) ?? []).join("\n");
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
}

function loadPrivateKey(): KeyObject {
  if (cachedPrivateKey) return cachedPrivateKey;
  const material = process.env.SANDBOX_PRIVATE_KEY || DEMO_PRIVATE_KEY_B64;
  if (material.includes("-----BEGIN")) {
    cachedPrivateKey = createPrivateKey(material);
    return cachedPrivateKey;
  }
  // Support both base64(DER) and base64(PEM text) encodings.
  const decoded = Buffer.from(material, "base64").toString("utf8");
  cachedPrivateKey = createPrivateKey(
    decoded.includes("-----BEGIN") ? decoded : pemFromDerBase64(material, "PRIVATE KEY")
  );
  return cachedPrivateKey;
}

function loadPublicKey(): KeyObject {
  if (cachedPublicKey) return cachedPublicKey;
  const material = process.env.SANDBOX_PUBLIC_KEY || DEMO_PUBLIC_KEY_B64;
  if (material.includes("-----BEGIN")) {
    cachedPublicKey = createPublicKey(material);
    return cachedPublicKey;
  }
  const decoded = Buffer.from(material, "base64").toString("utf8");
  cachedPublicKey = createPublicKey(
    decoded.includes("-----BEGIN") ? decoded : pemFromDerBase64(material, "PUBLIC KEY")
  );
  return cachedPublicKey;
}

/** SHA-256 hex digest of any canonical string. */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** Fingerprint (SHA-256, first 16 bytes hex) of the active public key. */
export function publicKeyFingerprint(): string {
  const der = loadPublicKey().export({ type: "spki", format: "der" }) as Buffer;
  return createHash("sha256").update(der).digest("hex").slice(0, 32).toUpperCase();
}

/** Base64 export of the active public key (for seal distribution). */
export function publicKeyBase64(): string {
  return loadPublicKey().export({ type: "spki", format: "der" }).toString("base64");
}

/**
 * Deterministic canonical representation of a bulletin. Both the sealing
 * service and any independent verifier reconstruct this exact byte sequence.
 */
export function canonicalBulletin(parts: {
  title: string;
  issuer: string;
  classification: string;
  body: string;
  publishedAt: string;
}): string {
  return [
    parts.title.trim(),
    parts.issuer.trim(),
    parts.classification.trim(),
    parts.body.replace(/\r\n/g, "\n").trim(),
    parts.publishedAt.trim(),
  ].join("\n|\n");
}

/** Ed25519 signature (base64) over the canonical bulletin bytes. */
export function signCanonical(canonical: string): string {
  return cryptoSign(null, Buffer.from(canonical, "utf8"), loadPrivateKey()).toString(
    "base64"
  );
}

/** Stateless Ed25519 verification against the active public key. */
export function verifyCanonical(canonical: string, signatureB64: string): boolean {
  try {
    return cryptoVerify(
      null,
      Buffer.from(canonical, "utf8"),
      loadPublicKey(),
      Buffer.from(signatureB64, "base64")
    );
  } catch {
    return false;
  }
}

export interface SealedBulletin {
  hash: string;
  signature: string;
  publicKey: string;
  publicKeyFingerprint: string;
  algorithm: string;
  digestAlgorithm: string;
  signedAt: string;
}

/** Produce the complete digital seal for a bulletin in one call. */
export function sealBulletin(parts: {
  title: string;
  issuer: string;
  classification: string;
  body: string;
  publishedAt: string;
}): SealedBulletin {
  const canonical = canonicalBulletin(parts);
  return {
    hash: sha256Hex(canonical),
    signature: signCanonical(canonical),
    publicKey: publicKeyBase64(),
    publicKeyFingerprint: publicKeyFingerprint(),
    algorithm: SIGNING_ALGORITHM,
    digestAlgorithm: DIGEST_ALGORITHM,
    signedAt: new Date().toISOString(),
  };
}
