import type { BulletinClassification, Country } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

/* ── Document stamps ────────────────────────────────────────────────────────
   Square, letterspaced, hatched-border classification chips — the visual
   language of official registries. No rounded pills, no soft colours.     */

const CLASSIFICATION_STYLES: Record<BulletinClassification, string> = {
  PUBLIC: "border-verify/50 text-verify bg-verify-soft",
  MEDIA: "border-gold/60 text-gold-ink bg-gold-soft",
  OFFICIAL: "border-[#9AA3AE] text-[#3D4650] bg-[#F1F2F0]",
  CRISIS: "border-alert/50 text-alert bg-alert-soft",
};

export function ClassificationBadge({
  value,
  className,
}: {
  value: BulletinClassification;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em]",
        CLASSIFICATION_STYLES[value],
        className
      )}
    >
      {value}
    </span>
  );
}

/* ── Country identification (replaces emoji flags) ────────────────────────── */

const COUNTRY_META: Record<Country, { code: string; name: string; swatch: string }> = {
  ZA: { code: "ZA", name: "South Africa", swatch: "bg-verify" },
  TR: { code: "TR", name: "Türkiye", swatch: "bg-alert" },
};

export function CountryFlag({ country }: { country: Country }) {
  const meta = COUNTRY_META[country];
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-2.5 w-2.5 shrink-0", meta.swatch)}
    />
  );
}

export function CountryBadge({ country }: { country: Country }) {
  const meta = COUNTRY_META[country];
  return (
    <span className="inline-flex items-center gap-1.5 border border-hairline bg-white px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink">
      <CountryFlag country={country} />
      {meta.name}
    </span>
  );
}

/* ── Registry metrics ─────────────────────────────────────────────────────── */

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card className="border-hairline bg-card">
      <CardContent className="p-4 sm:p-5">
        <div aria-hidden="true" className="mb-3 h-[2px] w-8 bg-gold" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              {label}
            </p>
            <p className="mt-1.5 font-serif text-3xl font-semibold tabular-nums leading-none text-navy">
              {value}
            </p>
            {hint ? (
              <p className="mt-2 text-[11px] leading-snug text-ink-soft line-clamp-2">
                {hint}
              </p>
            ) : null}
          </div>
          <div className="shrink-0 border border-hairline p-1.5 text-navy-mid">
            <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="border-hairline bg-card">
      <CardContent className="flex items-start gap-3 p-4 sm:p-5">
        <Skeleton className="h-9 w-9" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Section heading ──────────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-gold-ink">
          <span aria-hidden="true" className="h-px w-6 bg-gold" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-serif text-xl font-semibold tracking-tight text-navy sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}
    </div>
  );
}

/* ── Pillar cards (Roman numeration, treaty style) ────────────────────────── */

export function PillarCard({
  icon: Icon,
  numeral,
  title,
  points,
}: {
  icon: LucideIcon;
  numeral: string;
  title: string;
  points: string[];
}) {
  return (
    <Card className="h-full border-hairline bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="bg-navy px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#F2EFE7]">
            {numeral}
          </span>
          <div className="border border-hairline p-1.5 text-navy-mid">
            <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
          </div>
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-navy">
          {title}
        </h3>
        <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold" />
        <ul className="mt-4 space-y-3">
          {points.map((p) => (
            <li
              key={p}
              className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-gold"
              />
              {p}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
