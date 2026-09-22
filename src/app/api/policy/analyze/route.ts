import { NextResponse } from "next/server";
import { runPolicyAnalysis, AIServiceUnavailableError } from "@/lib/policy";
import type { TranslateDirection } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { text?: string; direction?: TranslateDirection };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  const direction: TranslateDirection =
    body.direction === "EN-TR" ? "EN-TR" : "TR-EN";

  if (text.length < 20) {
    return NextResponse.json(
      { error: "Policy text must be at least 20 characters" },
      { status: 400 }
    );
  }
  if (text.length > 8000) {
    return NextResponse.json(
      { error: "Policy text must be at most 8,000 characters" },
      { status: 400 }
    );
  }

  try {
    const { analysis, degraded, processingMs } = await runPolicyAnalysis(
      text,
      direction
    );
    return NextResponse.json({
      ok: true,
      data: analysis,
      degraded,
      meta: { processingMs, direction },
    });
  } catch (err) {
    if (err instanceof AIServiceUnavailableError) {
      return NextResponse.json(
        {
          error:
            "AI service unavailable on this deployment. Set ZAI_API_KEY and ZAI_BASE_URL environment variables (see README).",
          code: "AI_UNAVAILABLE",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Policy analysis failed unexpectedly" },
      { status: 500 }
    );
  }
}
