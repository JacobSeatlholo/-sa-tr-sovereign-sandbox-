import { NextResponse } from "next/server";
import { sealBulletin, canonicalBulletin, SIGNING_ALGORITHM } from "@/lib/pki";
import { addBulletin, listBulletins, recordEvent } from "@/lib/store";
import type { Bulletin, BulletinClassification } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_CLASSIFICATIONS: BulletinClassification[] = [
  "PUBLIC",
  "MEDIA",
  "OFFICIAL",
  "CRISIS",
];

/** GET /api/bulletins — sealed bulletin registry. */
export async function GET() {
  return NextResponse.json({
    bulletins: listBulletins(),
    signingAlgorithm: SIGNING_ALGORITHM,
  });
}

/** POST /api/bulletins — publish a bulletin and affix its cryptographic seal. */
export async function POST(req: Request) {
  let body: {
    title?: string;
    issuer?: string;
    classification?: string;
    body?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const issuer = (body.issuer ?? "").trim();
  const classification = (body.classification ?? "PUBLIC").toUpperCase();
  const content = (body.body ?? "").trim();

  if (title.length < 5) {
    return NextResponse.json(
      { error: "Title must be at least 5 characters" },
      { status: 400 }
    );
  }
  if (issuer.length < 3) {
    return NextResponse.json(
      { error: "Issuer must be at least 3 characters" },
      { status: 400 }
    );
  }
  if (content.length < 40) {
    return NextResponse.json(
      { error: "Bulletin body must be at least 40 characters" },
      { status: 400 }
    );
  }
  if (content.length > 10000) {
    return NextResponse.json(
      { error: "Bulletin body must be at most 10,000 characters" },
      { status: 400 }
    );
  }
  if (!VALID_CLASSIFICATIONS.includes(classification as BulletinClassification)) {
    return NextResponse.json(
      { error: `Classification must be one of: ${VALID_CLASSIFICATIONS.join(", ")}` },
      { status: 400 }
    );
  }

  const publishedAt = new Date().toISOString();

  const bulletin: Bulletin = {
    id: `bul-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    issuer,
    classification: classification as BulletinClassification,
    body: content,
    publishedAt,
    seal: sealBulletin({ title, issuer, classification, body: content, publishedAt }),
  };

  addBulletin(bulletin);
  recordEvent(
    "SEAL",
    `Bulletin sealed — “${title}”`,
    `${bulletin.id} · ${classification} · SHA-256 ${bulletin.seal.hash.slice(0, 16)}…`
  );

  return NextResponse.json(
    {
      ok: true,
      bulletin,
      canonical: canonicalBulletin({
        title,
        issuer,
        classification,
        body: content,
        publishedAt,
      }),
    },
    { status: 201 }
  );
}
