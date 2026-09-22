import { NextResponse } from "next/server";
import { matchCounterparties } from "@/lib/matching";
import { recordEvent } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/trade/match
 * Body: { companyId } to match an existing registry member, or
 *       { query } for a free-text trade need.
 */
export async function POST(req: Request) {
  let body: { companyId?: string; query?: string; limit?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { companyId, query } = body;
  const limit = Math.min(Math.max(body.limit ?? 6, 1), 10);

  if (!companyId && (!query || query.trim().length < 5)) {
    return NextResponse.json(
      { error: "Provide `companyId` or a `query` of at least 5 characters" },
      { status: 400 }
    );
  }

  const { source, matches } = matchCounterparties({
    companyId,
    query,
    limit,
  });

  recordEvent(
    "MATCH",
    source
      ? `Trade match — source “${source.name}” · ${matches.length} counterparties ranked`
      : `Trade match — query “${query?.slice(0, 60)}” · ${matches.length} counterparties ranked`,
    matches
      .slice(0, 3)
      .map((m) => `${m.company.name} (${m.score})`)
      .join(" · ")
  );

  if (!source && (!matches || matches.length === 0)) {
    return NextResponse.json(
      {
        error:
          "No semantic matches found — try naming sectors, products or capabilities",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    source,
    matches,
    engine: "TF-IDF cosine similarity (MVP) — pgvector upgrade planned for Phase 2",
  });
}
