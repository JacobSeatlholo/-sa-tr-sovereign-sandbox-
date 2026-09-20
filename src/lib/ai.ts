// ─────────────────────────────────────────────────────────────────────────────
// AI service wrapper (z-ai-web-dev-sdk) — server-side only.
//
// Sandbox: works out of the box via /etc/.z-ai-config.
// Vercel:  set ZAI_API_KEY + ZAI_BASE_URL env vars; this module bootstraps a
//          config file into a writable temp HOME before ZAI.create().
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import os from "os";

type ZAIInstance = {
  chat: {
    completions: {
      create: (body: Record<string, unknown>) => Promise<{
        choices?: { message?: { content?: string } }[];
      }>;
    };
  };
};

let cached: ZAIInstance | null = null;

/**
 * Make the SDK resolvable on read-only serverless filesystems by materialising
 * the config from environment variables into a temp home directory.
 */
function bootstrapConfigFromEnv(): void {
  const { ZAI_API_KEY, ZAI_BASE_URL } = process.env;
  if (!ZAI_API_KEY || !ZAI_BASE_URL) return;

  const candidates = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(os.homedir(), ".z-ai-config"),
    "/etc/.z-ai-config",
  ];
  if (candidates.some((p) => existsSync(p))) return;

  try {
    const home = "/tmp/zai-home";
    mkdirSync(home, { recursive: true });
    writeFileSync(
      path.join(home, ".z-ai-config"),
      JSON.stringify({ baseUrl: ZAI_BASE_URL, apiKey: ZAI_API_KEY })
    );
    process.env.HOME = home; // os.homedir() follows $HOME on Linux
  } catch {
    // Fall through — ZAI.create() will surface a descriptive error.
  }
}

export async function getAI(): Promise<ZAIInstance> {
  if (cached) return cached;
  bootstrapConfigFromEnv();
  const mod = await import("z-ai-web-dev-sdk");
  const ZAI = (mod.default ?? mod) as unknown as {
    create: () => Promise<ZAIInstance>;
  };
  cached = await ZAI.create();
  return cached;
}

export class AIServiceUnavailableError extends Error {
  constructor(message = "AI service is not configured on this deployment") {
    super(message);
    this.name = "AIServiceUnavailableError";
  }
}

/** Single completion helper with uniform error mapping. */
export async function complete(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  let zai: ZAIInstance;
  try {
    zai = await getAI();
  } catch {
    throw new AIServiceUnavailableError();
  }
  try {
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
      temperature: opts?.temperature ?? 0.2,
      max_tokens: opts?.maxTokens ?? 2000,
    });
    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty completion");
    return content;
  } catch (err) {
    if (err instanceof AIServiceUnavailableError) throw err;
    throw new AIServiceUnavailableError(
      `AI request failed: ${err instanceof Error ? err.message : "unknown error"}`
    );
  }
}
