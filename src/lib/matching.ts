// ─────────────────────────────────────────────────────────────────────────────
// Vector Search Matching Engine (MVP edition)
//
// Proposal reference (Pillar 2): "Utilizing PostgreSQL and pgvector cosine
// similarity algorithms to automatically match South African suppliers with
// Turkish enterprise buyers under AfCFTA guidelines."
//
// For the Phase 1 sandbox we implement the same cosine-similarity scoring with
// an in-process TF-IDF vector space — deterministic, dependency-free, and
// serverless-safe. The Phase 2 upgrade swaps this module for pgvector
// embeddings (see README → "Phase 2 upgrade path") without changing callers.
// ─────────────────────────────────────────────────────────────────────────────

import type { Company, MatchResult } from "./types";
import { COMPANIES } from "./seed-data";

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
  "has", "have", "had", "its", "their", "our", "your", "into", "onto", "over",
  "under", "between", "across", "toward", "towards", "within", "without",
  "will", "shall", "would", "could", "should", "can", "may", "might", "must",
  "seeks", "seek", "sourcing", "sources", "supply", "supplies", "supplier",
  "buyer", "provide", "provides", "partner", "partners", "company", "group",
  "systems", "solutions", "services", "products", "quality", "based",
  "a", "an", "of", "in", "on", "to", "by", "as", "at", "is", "it", "be",
]);

/** Lightweight stemmer: normalises plurals/gerunds so "solar mounts" ≈ "mounting". */
function normalizeToken(token: string): string {
  let t = token.toLowerCase();
  if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ers")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("es")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  return t;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äâçéèêëıïîöşüûñ\s-]/gi, " ")
    .split(/[\s\-/,]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    .map(normalizeToken)
    .filter((t) => t.length > 2);
}

/** Profile text used to build a company's document vector. */
function companyDocument(c: Company): string {
  return [
    c.sector,
    c.description,
    c.capabilities.join(" "),
    c.certifications.join(" "),
    c.city,
    c.role === "supplier" ? "exporter manufacturer producer" : "importer procurer procurement",
  ].join(" ");
}

// ── Corpus construction ──────────────────────────────────────────────────────

const CORPUS_DOCS = COMPANIES.map(companyDocument);
const CORPUS_TOKENS = CORPUS_DOCS.map(tokenize);

const DF = new Map<string, number>();
for (const tokens of CORPUS_TOKENS) {
  for (const t of new Set(tokens)) DF.set(t, (DF.get(t) ?? 0) + 1);
}
const N = CORPUS_DOCS.length;

function idf(term: string): number {
  const df = DF.get(term) ?? 0;
  return Math.log((N + 1) / (df + 1)) + 1;
}

function tfIdfVector(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const vec = new Map<string, number>();
  for (const [term, count] of tf) {
    vec.set(term, (count / tokens.length) * idf(term));
  }
  return vec;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const v of a.values()) magA += v * v;
  for (const [term, v] of b) {
    magB += v * v;
    const av = a.get(term);
    if (av) dot += av * v;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Pre-compute company vectors once at module load.
const COMPANY_VECTORS = CORPUS_TOKENS.map(tfIdfVector);

function vectorizeCompany(c: Company): Map<string, number> {
  // Re-use precomputed vector when available.
  const idx = COMPANIES.findIndex((x) => x.id === c.id);
  return idx >= 0 ? COMPANY_VECTORS[idx] : tfIdfVector(tokenize(companyDocument(c)));
}

// ── Public API ───────────────────────────────────────────────────────────────

export function findCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function listCompanies(filter?: {
  country?: "ZA" | "TR";
  sector?: string;
  q?: string;
}): Company[] {
  let out = COMPANIES;
  if (filter?.country) out = out.filter((c) => c.country === filter.country);
  if (filter?.sector) {
    const s = filter.sector.toLowerCase();
    out = out.filter((c) => c.sector.toLowerCase().includes(s));
  }
  if (filter?.q) {
    const toks = tokenize(filter.q);
    out = out.filter((c) => {
      const hay = tokenize(companyDocument(c));
      return toks.every((t) => hay.some((h) => h.includes(t) || t.includes(h)));
    });
  }
  return out;
}

/**
 * Rank cross-border counterparties for a company or a free-text trade need.
 * Turkish buyers ↔ South African suppliers is the primary corridor.
 */
export function matchCounterparties(opts: {
  companyId?: string;
  query?: string;
  limit?: number;
}): { source: Company | null; matches: MatchResult[] } {
  const source = opts.companyId ? findCompany(opts.companyId) ?? null : null;

  const queryTokens = source
    ? tokenize(companyDocument(source))
    : tokenize(opts.query ?? "");

  if (queryTokens.length === 0) {
    return { source, matches: [] };
  }

  const queryVec = tfIdfVector(queryTokens);
  const candidates = source
    ? COMPANIES.filter(
        (c) => c.id !== source.id && c.country !== source.country
      )
    : COMPANIES;

  const matches: MatchResult[] = candidates.map((c) => {
    const sim = cosine(queryVec, vectorizeCompany(c));

    // Explainability: which query terms appear in the candidate profile?
    const candTokens = new Set(tokenize(companyDocument(c)));
    const matchedTerms = [...new Set(queryTokens)].filter((t) =>
      candTokens.has(t)
    );

    // Sector exact-match bonus (business-rule boost on top of semantics).
    const sectorOverlap = source
      ? source.sector.toLowerCase() === c.sector.toLowerCase()
      : false;
    const boosted = sim + (sectorOverlap ? 0.06 : 0);

    // Corridor reinforcement: opposite-side counterparties are the point.
    const corridor = source && c.country !== source.country ? 0.02 : 0;

    const score = Math.min(100, Math.round((boosted + corridor) * 260));

    const rationale = sectorOverlap
      ? `Same sector (${c.sector}) with ${matchedTerms.length} shared capability signals`
      : `${matchedTerms.length} semantic capability matches${
          source ? ` across the ${source.country === "ZA" ? "ZA → TR" : "TR → ZA"} corridor` : ""
        }`;

    return { company: c, score, matchedTerms, sectorOverlap, rationale };
  });

  matches.sort((a, b) => b.score - a.score);
  return { source, matches: matches.slice(0, opts.limit ?? 6) };
}
