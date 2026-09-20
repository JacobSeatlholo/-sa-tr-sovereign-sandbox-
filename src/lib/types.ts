// ─────────────────────────────────────────────────────────────────────────────
// SA–Türkiye Sovereign AI & Digital Trade Sandbox — Shared Types
// Phase 1 Proof-of-Concept (Business Hustle / Simple Eternity Holdings)
// ─────────────────────────────────────────────────────────────────────────────

export type Country = "ZA" | "TR";

export type CompanyRole = "supplier" | "buyer";

export interface Company {
  id: string;
  name: string;
  country: Country;
  countryName: string;
  role: CompanyRole;
  city: string;
  sector: string;
  description: string;
  capabilities: string[];
  certifications: string[];
  employees: string;
  demoNote?: string;
}

export interface MatchResult {
  company: Company;
  score: number; // 0–100
  matchedTerms: string[];
  sectorOverlap: boolean;
  rationale: string;
}

export type BulletinClassification =
  | "PUBLIC"
  | "MEDIA"
  | "OFFICIAL"
  | "CRISIS";

export interface BulletinSeal {
  algorithm: string;
  hash: string; // SHA-256 hex digest of the canonical bulletin
  signature: string; // base64 Ed25519 signature over the canonical bulletin
  publicKey: string; // base64 public key used for verification
  publicKeyFingerprint: string; // SHA-256 fingerprint of the public key
  signedAt: string; // ISO timestamp included in the canonical payload
}

export interface Bulletin {
  id: string;
  title: string;
  issuer: string;
  classification: BulletinClassification;
  body: string;
  publishedAt: string;
  seal: BulletinSeal;
}

export interface VerificationCheck {
  hashMatch: boolean;
  signatureValid: boolean;
}

export interface VerificationResult {
  authentic: boolean;
  checks: VerificationCheck;
  message: string;
  verifiedAt: string;
  details: {
    recomputedHash: string;
    providedHash: string;
    publicKeyFingerprint: string;
  };
}

export interface PolicyCommitment {
  commitment: string;
  actor: string;
  deadline: string | null;
  category: string;
}

export interface PolicyAnalysis {
  translation: string;
  summary: string;
  commitments: PolicyCommitment[];
  domains: string[];
  riskFlags: string[];
}

export type TranslateDirection = "TR-EN" | "EN-TR";

export interface SandboxStats {
  bulletinsSealed: number;
  verificationsPerformed: number;
  companiesListed: number;
  policyAnalyses: number;
  uptimeNote: string;
}
