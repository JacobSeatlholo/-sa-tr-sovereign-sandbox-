// ─────────────────────────────────────────────────────────────────────────────
// Diplomatic Policy Indexer — shared analysis pipeline.
//
// Used by both the /api/policy/analyse route and the /api/console command
// interpreter, so the console exercises the exact same intelligence pipeline
// as the dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { complete, AIServiceUnavailableError } from "./ai";
import { incrementPolicyAnalyses, recordEvent } from "./store";
import type { PolicyAnalysis, TranslateDirection } from "./types";

const SYSTEM_PROMPT = `You are the Diplomatic Policy Indexer of the South Africa–Türkiye Sovereign AI & Digital Trade Sandbox — an expert bilateral policy analyst fluent in Turkish and English.

Your task: analyse a policy text and return STRICT JSON only (no markdown fences, no commentary) with this exact shape:
{
  "translation": "full faithful English translation (or original-language rendition if the text is already in the target language) preserving legal nuance, article numbering and named entities",
  "summary": "executive summary of 3-5 sentences capturing intent, scope and obligations",
  "commitments": [
    { "commitment": "specific obligation stated in the text", "actor": "who must act", "deadline": "ISO date, quarter, or timeframe string as stated, or null", "category": "one of: governance | trade | technology | education | security | other" }
  ],
  "domains": ["policy domains touched, e.g. digital trade, AI governance, customs"],
  "riskFlags": ["compliance or implementation risks worth flagging for officials, e.g. POPIA/KVKK data considerations — empty array if none"]
}

Rules:
- Track EVERY concrete obligation, timeline and institutional actor as a structured commitment.
- Keep named institutions exactly as written (do not translate proper nouns of organisations).
- If the input language equals the requested output direction, still produce the full analysis (translation field then holds the polished rendition).
- Output must be valid, parseable JSON. No trailing commas.`;

function parseAnalysis(raw: string): PolicyAnalysis | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  // First: direct parse. Second: salvage the outermost JSON object.
  const candidates = [cleaned];
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last > first) candidates.push(cleaned.slice(first, last + 1));

  for (const candidate of candidates) {
    try {
      const obj = JSON.parse(candidate) as Partial<PolicyAnalysis>;
      if (typeof obj.translation === "string" && obj.translation.length > 0) {
        return {
          translation: obj.translation,
          summary: typeof obj.summary === "string" ? obj.summary : "",
          commitments: Array.isArray(obj.commitments)
            ? obj.commitments
                .filter((c) => c && typeof c.commitment === "string")
                .map((c) => ({
                  commitment: String(c.commitment),
                  actor: typeof c.actor === "string" ? c.actor : "Unspecified",
                  deadline:
                    typeof c.deadline === "string" && c.deadline.trim().length
                      ? c.deadline
                      : null,
                  category: typeof c.category === "string" ? c.category : "other",
                }))
            : [],
          domains: Array.isArray(obj.domains) ? obj.domains.map(String) : [],
          riskFlags: Array.isArray(obj.riskFlags) ? obj.riskFlags.map(String) : [],
        };
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

export interface PolicyAnalysisOutcome {
  analysis: PolicyAnalysis;
  degraded: boolean;
  processingMs: number;
}

/**
 * Run the full TR↔EN policy analysis. Throws AIServiceUnavailableError when
 * the inference pipeline is not configured on the deployment.
 */
export async function runPolicyAnalysis(
  text: string,
  direction: TranslateDirection = "TR-EN"
): Promise<PolicyAnalysisOutcome> {
  const userPrompt = `Analyse the following official text for the ${
    direction === "TR-EN" ? "Turkish → English" : "English → Turkish"
  } bilateral channel.

--- BEGIN OFFICIAL TEXT ---
${text}
--- END OFFICIAL TEXT ---`;

  const started = Date.now();
  const raw = await complete(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.15, maxTokens: 3000 }
  );

  const analysis = parseAnalysis(raw);
  incrementPolicyAnalyses();
  const processingMs = Date.now() - started;

  if (!analysis) {
    const fallback: PolicyAnalysis = {
      translation: raw.trim(),
      summary:
        "Structured parsing unavailable for this input; raw rendition returned.",
      commitments: [],
      domains: [],
      riskFlags: [],
    };
    recordEvent(
      "ANALYSIS",
      `Policy analysis completed (degraded) — ${direction} channel`,
      `${text.length} characters · ${processingMs}ms`
    );
    return { analysis: fallback, degraded: true, processingMs };
  }

  recordEvent(
    "ANALYSIS",
    `Policy analysis completed — ${direction} channel · ${analysis.commitments.length} commitments extracted`,
    `${text.length} characters · ${processingMs}ms`
  );

  return { analysis, degraded: false, processingMs };
}

export { AIServiceUnavailableError };
