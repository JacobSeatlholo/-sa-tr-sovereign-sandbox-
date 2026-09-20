import { NextResponse } from "next/server";
import { listCompanies } from "@/lib/matching";

export const dynamic = "force-dynamic";

/** GET /api/trade/companies?country=ZA|TR&sector=&q= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryParam = searchParams.get("country");
  const country =
    countryParam === "ZA" || countryParam === "TR" ? countryParam : undefined;
  const sector = searchParams.get("sector") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const companies = listCompanies({ country, sector, q });

  return NextResponse.json({
    count: companies.length,
    companies,
  });
}
