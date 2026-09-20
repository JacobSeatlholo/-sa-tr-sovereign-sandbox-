// ─────────────────────────────────────────────────────────────────────────────
// Sandbox seed dataset — Phase 1 demo registries.
// Companies are illustrative demo entries standing in for OpenTender ZA /
// BlackBiz / chamber registries (live civic-data integration is Phase 2).
// ─────────────────────────────────────────────────────────────────────────────

import type { Bulletin, Company } from "./types";
import { canonicalBulletin, sealBulletin } from "./pki";

export const COMPANIES: Company[] = [
  // ── South African suppliers (SMMEs) ───────────────────────────────────────
  {
    id: "za-001",
    name: "Karoo AgriFoods Cooperative",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Cape Town",
    sector: "Agri-Processing",
    description:
      "Cooperative of 140 smallholder farms processing premium dried fruit, rooibos extract and cold-pressed oils for export markets. Halal-certified facility with EU-compliant traceability.",
    capabilities: [
      "dried fruit",
      "rooibos extract",
      "cold-pressed oils",
      "food processing",
      "export packaging",
      "private label",
    ],
    certifications: ["Halal", "HACCP", "GlobalG.A.P.", "AfCFTA Certificate of Origin"],
    employees: "120–250",
  },
  {
    id: "za-002",
    name: "Amatola Solar Components",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "East London",
    sector: "Renewable Energy",
    description:
      "Manufactures mounting structures, junction boxes and cable management systems for utility-scale solar plants. Supplies the Northern Cape solar corridor and exports to SADC.",
    capabilities: [
      "solar mounting structures",
      "junction boxes",
      "cable management",
      "steel fabrication",
      "renewable energy components",
      "OEM tooling",
    ],
    certifications: ["ISO 9001", "B-BBEE Level 1", "IEC 61215 compliant"],
    employees: "80–120",
  },
  {
    id: "za-003",
    name: "Ubuntu FinTech Systems",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Johannesburg",
    sector: "ICT & FinTech",
    description:
      "Builds white-label mobile payment rails, cross-border settlement APIs and SME lending scoring engines. PCI-DSS certified with deployments in 9 African markets.",
    capabilities: [
      "payment gateway",
      "cross-border settlement API",
      "SME credit scoring",
      "mobile money",
      "white-label banking",
      "ISO 20022 messaging",
    ],
    certifications: ["PCI-DSS", "ISO 27001", "POPIA compliant"],
    employees: "50–80",
  },
  {
    id: "za-004",
    name: "Highveld Mining Supplies",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Johannesburg",
    sector: "Mining Equipment",
    description:
      "Fabricates conveyor idlers, screen panels and drill consumables for platinum and gold operations. Offers OEM-equivalent parts at 30–40% below import parity pricing.",
    capabilities: [
      "conveyor idlers",
      "screen panels",
      "drill consumables",
      "mining spares",
      "wear-resistant steel",
      " OEM-equivalent parts",
    ],
    certifications: ["ISO 9001", "SANS approved", "B-BBEE Level 2"],
    employees: "100–180",
  },
  {
    id: "za-005",
    name: "Zenzele Textile Studio",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Durban",
    sector: "Textiles & Apparel",
    description:
      "Design-led studio producing technical workwear, school uniforms and heritage home textiles. CMT capacity of 25,000 units/month with in-house pattern engineering.",
    capabilities: [
      "technical workwear",
      "uniforms",
      "home textiles",
      "CMT manufacturing",
      "pattern engineering",
      "small-batch production",
    ],
    certifications: ["SABS approved", "B-BBEE Level 1", "OEKO-TEX dyes"],
    employees: "60–90",
  },
  {
    id: "za-006",
    name: "Bantorque Automotive Components",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Port Elizabeth",
    sector: "Automotive",
    description:
      "Tier-2 supplier machining aluminium die-cast housings, brake brackets and EV busbars for the Eastern Cape automotive cluster. IATF-registered with in-house X-ray inspection.",
    capabilities: [
      "aluminium die-casting",
      "brake brackets",
      "EV busbars",
      "precision machining",
      "automotive tier-2 supply",
      "IATF 16949",
    ],
    certifications: ["IATF 16949", "ISO 14001", "AIAG core tools"],
    employees: "150–300",
  },
  {
    id: "za-007",
    name: "Cape Digital Foundry",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Cape Town",
    sector: "ICT & FinTech",
    description:
      "Software house specialising in customs digitalisation, port community systems and trade document e-signatures. Delivered the e-permit stack for two SADC customs authorities.",
    capabilities: [
      "customs digitalisation",
      "port community systems",
      "e-signature",
      "trade documentation",
      "government platforms",
      "data integration",
    ],
    certifications: ["ISO 27001", "POPIA compliant", "WCO SAFE aligning"],
    employees: "40–70",
  },
  {
    id: "za-008",
    name: "Kruger Botanicals Exchange",
    country: "ZA",
    countryName: "South Africa",
    role: "supplier",
    city: "Nelspruit",
    sector: "Agri-Processing",
    description:
      "Wild-harvests and cultivates baobab powder, marula oil and buchu extract for nutraceutical and cosmetics brands. Fully traceable supply chain with community benefit-sharing agreements.",
    capabilities: [
      "baobab powder",
      "marula oil",
      "buchu extract",
      "nutraceutical ingredients",
      "cosmetic actives",
      "benefit-sharing compliant",
    ],
    certifications: ["Organic EU/USDA", "Halal", "Nagoya Protocol compliant"],
    employees: "70–110",
  },

  // ── Türkiye buyers / importers ────────────────────────────────────────────
  {
    id: "tr-001",
    name: "Anadolu Gıda A.Ş.",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "Gaziantep",
    sector: "Food & Beverage",
    description:
      "Industrial food group sourcing dried fruit, herbal extracts and specialty oils for its snack bars and functional beverages exported to the EU and MENA. Seeks long-term origin supply agreements.",
    capabilities: [
      "dried fruit sourcing",
      "herbal extracts",
      "functional beverages",
      "snack manufacturing",
      "private label",
      "EU re-export",
    ],
    certifications: ["ISO 22000", "Halal", "BRCGS"],
    employees: "500–1000",
  },
  {
    id: "tr-002",
    name: "Marmara Enerji Sistemleri",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "İstanbul",
    sector: "Renewable Energy",
    description:
      "EPC contractor delivering 1.2 GW of solar across Anatolia. Procures mounting structures, junction boxes and balance-of-system components for localisation of its supply chain.",
    capabilities: [
      "solar EPC",
      "mounting structures procurement",
      "junction boxes",
      "balance of system",
      "solar localisation",
      "utility-scale projects",
    ],
    certifications: ["ISO 9001", "TSE approved installer", "EÜAS licensed"],
    employees: "300–600",
  },
  {
    id: "tr-003",
    name: "Boğaziçi Ödeme Teknolojileri",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "İstanbul",
    sector: "ICT & FinTech",
    description:
      "Licensed payment institution building corridor remittance products for the Africa trade lane. Seeks white-label settlement engines and SME scoring partners for AfCFTA corridors.",
    capabilities: [
      "payment institution",
      "remittance corridors",
      "white-label settlement",
      "SME scoring",
      "Africa corridor",
      "API-first banking",
    ],
    certifications: ["TCMB licensed", "PCI-DSS", "ISO 27001"],
    employees: "200–400",
  },
  {
    id: "tr-004",
    name: "Toros Maden Makina",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "Konya",
    sector: "Mining Equipment",
    description:
      "Distributes mining equipment and consumables to Turkish boron and chrome operations. Sources idlers, screen panels and drill consumables under agency and OEM partnerships.",
    capabilities: [
      "mining distribution",
      "conveyor components",
      "screen media",
      "drill consumables",
      "after-sales service",
      "boron & chrome sector",
    ],
    certifications: ["ISO 9001", "CE marked imports", "TSE service authorisation"],
    employees: "150–250",
  },
  {
    id: "tr-005",
    name: "Ege Tekstil Grubu",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "İzmir",
    sector: "Textiles & Apparel",
    description:
      "Vertical apparel group supplying EU fast-fashion and technical workwear tenders. Seeks CMT capacity partners and heritage textile collections to widen its catalogue.",
    capabilities: [
      "apparel manufacturing",
      "technical workwear tenders",
      "CMT outsourcing",
      "EU fast fashion supply",
      "catalogue sourcing",
      "quality compliance",
    ],
    certifications: ["OEKO-TEX", "BSCI audited", "ISO 9001"],
    employees: "800–1500",
  },
  {
    id: "tr-006",
    name: "Ulusoy Otomotiv Yan Sanayi",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "Bursa",
    sector: "Automotive",
    description:
      "Tier-1 supplier of braking and chassis components to European OEMs. Interested in aluminium die-cast housings and EV busbar subassemblies to de-risk its footprint.",
    capabilities: [
      "braking components",
      "chassis systems",
      "aluminium housings procurement",
      "EV busbars",
      "tier-1 OEM supply",
      "dual-sourcing strategy",
    ],
    certifications: ["IATF 16949", "ISO 14001", "VDA 6.3 audited"],
    employees: "1000–2000",
  },
  {
    id: "tr-007",
    name: "Anadolu Yazılım Bilişim",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "Ankara",
    sector: "ICT & FinTech",
    description:
      "Government-focused integrator delivering e-customs and trade single-window projects across Turkic states. Seeks proven port community and customs digitalisation technology partners.",
    capabilities: [
      "e-customs projects",
      "single window",
      "port community systems",
      "public sector integration",
      "Turkic states footprint",
      "technology partnering",
    ],
    certifications: ["ISO 27001", "NATO AQAP aware", "KVKK compliant"],
    employees: "250–450",
  },
  {
    id: "tr-008",
    name: "Akdeniz Kozmetik Sanayi",
    country: "TR",
    countryName: "Türkiye",
    role: "buyer",
    city: "Antalya",
    sector: "Cosmetics & Wellness",
    description:
      "Natural cosmetics manufacturer exporting to 40 countries. Sources traceable botanical actives such as baobab, marula and buchu for its premium spa and dermocosmetic lines.",
    capabilities: [
      "natural cosmetics",
      "botanical actives sourcing",
      "spa product lines",
      "dermocosmetics",
      "traceable supply chain",
      "export to 40 markets",
    ],
    certifications: ["ISO 22716 GMP", "COSMOS organic", "Halal"],
    employees: "300–500",
  },
];

// ── Seeded bulletin registry ─────────────────────────────────────────────────

interface SeedBulletinSpec {
  id: string;
  title: string;
  issuer: string;
  classification: Bulletin["classification"];
  body: string;
  publishedAt: string;
}

const SEED_BULLETIN_SPECS: SeedBulletinSpec[] = [
  {
    id: "bul-001",
    title: "Joint Statement on Bilateral Digital Trade Cooperation",
    issuer: "Directorate of Communications (Republic of Türkiye) · Dirco (Republic of South Africa)",
    classification: "OFFICIAL",
    publishedAt: "2026-09-14T10:00:00.000Z",
    body: `Following the STRATCOM Roundtable convened at Melrose Arch, Johannesburg, the Republic of South Africa and the Republic of Türkiye affirm their intent to deepen cooperation on sovereign digital infrastructure, artificial intelligence governance and bilateral trade facilitation.

Both parties commit to exploring a joint sandbox for verified diplomatic communications and cross-border SMME trade matching, aligned with AfCFTA principles and the digital trade provisions of existing bilateral agreements.

This statement is issued for the public record and may be independently verified through the cryptographic seal affixed below.`,
  },
  {
    id: "bul-002",
    title: "Press Release: Launch of the SA–Türkiye Sovereign AI & Digital Trade Sandbox",
    issuer: "Business Hustle (Simple Eternity Holdings (Pty) Ltd)",
    classification: "MEDIA",
    publishedAt: "2026-09-18T08:30:00.000Z",
    body: `Business Hustle today announced the Phase 1 deployment of the South Africa–Türkiye Sovereign AI & Digital Trade Sandbox, a proof-of-concept platform bridging diplomatic strategy and private-sector trade execution.

The sandbox demonstrates three capabilities requested by bilateral stakeholders: automated Turkish–English policy analysis, cryptographically verifiable press bulletins, and semantic matching between South African SMMEs and Turkish enterprise buyers.

Verification of every bulletin published on this platform can be performed without trusted intermediaries by recomputing the SHA-256 digest and checking the Ed25519 digital signature.`,
  },
  {
    id: "bul-003",
    title: "Public Advisory: Verified Channels for Official Bilateral Communications",
    issuer: "Sandbox Operations Desk (Demo Issuer)",
    classification: "CRISIS",
    publishedAt: "2026-09-20T06:00:00.000Z",
    body: `Media houses and members of the public are advised that synthetic media impersonating bilateral officials has been reported circulating on social platforms. Authentic communications from the sandbox carry a valid SHA-256 digest and an Ed25519 signature verifiable with the official sandbox public key.

Any communication lacking a verifiable seal, or whose digest fails recomputation, should be treated as unverified and reported to platform operators.

This advisory is itself sealed so that its integrity can be checked independently at any time.`,
  },
];

export const SEED_BULLETINS: Bulletin[] = SEED_BULLETIN_SPECS.map((spec) => ({
  id: spec.id,
  title: spec.title,
  issuer: spec.issuer,
  classification: spec.classification,
  body: spec.body,
  publishedAt: spec.publishedAt,
  seal: {
    ...sealBulletin(spec),
    signedAt: spec.publishedAt,
  },
}));

export function buildSeedBulletin(spec: SeedBulletinSpec): Bulletin {
  return {
    id: spec.id,
    title: spec.title,
    issuer: spec.issuer,
    classification: spec.classification,
    body: spec.body,
    publishedAt: spec.publishedAt,
    seal: {
      ...sealBulletin(spec),
      signedAt: spec.publishedAt,
    },
  };
}

export { canonicalBulletin };
