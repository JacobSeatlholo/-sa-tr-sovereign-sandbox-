// ─────────────────────────────────────────────────────────────────────────────
// Client-safe static content (no Node-only imports) — coalition matrix,
// roadmap and the sample Turkish policy text used by the Policy Intelligence
// demo.
// ─────────────────────────────────────────────────────────────────────────────

export interface CoalitionMember {
  domain: string;
  institution: string;
  focus: string;
}

export const COALITION: CoalitionMember[] = [
  {
    domain: "Policy & Diplomacy",
    institution: "Directorate of Communications (Presidency of Türkiye)",
    focus: "Strategic communications & disinformation defense",
  },
  {
    domain: "Strategic Research",
    institution: "SETA · AFRASID",
    focus: "Research & policy verification",
  },
  {
    domain: "Institutional & Advisory",
    institution: "Strategic Advisory",
    focus: "Governance & programme assurance",
  },
  {
    domain: "Private Sector & Chambers",
    institution: "SACCI · RCCI · ProcureTrade",
    focus: "Enterprise onboarding & trade execution",
  },
  {
    domain: "Soft Power & Youth",
    institution: "Türkiye Maarif Foundation",
    focus: "Skills sandbox & youth developer pipelines",
  },
  {
    domain: "Media & Visibility",
    institution: "Press Coordination",
    focus: "Public verification channel adoption",
  },
];

export interface RoadmapPhase {
  phase: string;
  title: string;
  timeline: string;
  investment: string;
  scope: string[];
  status: "active" | "next" | "future";
}

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Proof-of-Concept Sandbox",
    timeline: "15–30 days",
    investment: "R210,108",
    scope: [
      "TR ↔ EN policy analysis engine",
      "PKI hashing & sealing endpoint",
      "Initial SMME matching interface",
      "Secure diplomatic dashboard",
    ],
    status: "active",
  },
  {
    phase: "Phase 2",
    title: "Full Sovereign Platform",
    timeline: "3–4 months",
    investment: "R420,000",
    scope: [
      "Multi-tenant platform & custom database architecture",
      "OpenTender ZA / BlackBiz live registry integration",
      "SACCI & ProcureTrade API integration",
      "POPIA / GDPR compliance hardening",
    ],
    status: "next",
  },
  {
    phase: "Phase 3",
    title: "Operations & Global Scaling",
    timeline: "Monthly",
    investment: "R30,000 / month",
    scope: [
      "Managed cloud infrastructure & SLA",
      "Continuous security audits",
      "ITU “Digit’all Voices” alignment (UNGA 2026)",
      "Dedicated support & model maintenance",
    ],
    status: "future",
  },
];

export const SAMPLE_TR_POLICY = `TÜRKİYE CUMHURİYETİ – GÜNEY AFRİKA CUMHURİYETİ
İkili Dijital Ticaret ve Yapay Zekâ İş Birliği Ortak Bildirisi (Özet Metin)

Taraflar, dijital ekonomi alanındaki iş birliğini derinleştirmek amacıyla, küçük ve orta ölçekli işletmelerin (KOBİ) sınır ötesi ticaretine yönelik ortak bir teknik platform kurulmasını kabul etmiştir.

1. Taraflar, resmî iletişimlerin güvenilirliğini artırmak amacıyla kriptografik doğrulama altyapısını 2026 yılının son çeyreğine kadar devreye alacaktır.

2. Güney Afrika tarafı, OpenTender ZA ve BlackBiz kayıtlarının teknik entegrasyonu için gerekli veri erişimini sağlayacaktır.

3. Taraflar, AfCFTA çerçevesinde gümrük dijitalleşmesi ve e-imza uygulamalarının uyumlaştırılması konusunda bir çalışma grubu oluşturacak ve ilk toplantıyı üç ay içinde gerçekleştirecektir.

4. Türkiye Maarif Vakfı, genç geliştiriciler için eğitim programları düzenleyecek; hedef, iki ülke toplamda 500 yazılımcının platform ekosistemine kazandırılmasıdır.`;
