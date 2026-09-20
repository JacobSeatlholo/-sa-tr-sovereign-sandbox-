import type { BulletinClassification, Country } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

export const CLASSIFICATION_STYLES: Record<
  BulletinClassification,
  string
> = {
  PUBLIC: "bg-emerald-100 text-emerald-800 border-emerald-300",
  MEDIA: "bg-amber-100 text-amber-800 border-amber-300",
  OFFICIAL: "bg-stone-200 text-stone-800 border-stone-300",
  CRISIS: "bg-red-100 text-red-800 border-red-300",
};

export function ClassificationBadge({
  value,
  className,
}: {
  value: BulletinClassification;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(CLASSIFICATION_STYLES[value], "font-semibold", className)}
    >
      {value}
    </Badge>
  );
}

export function CountryFlag({ country }: { country: Country }) {
  return (
    <span aria-hidden="true" className="text-base leading-none">
      {country === "ZA" ? "🇿🇦" : "🇹🇷"}
    </span>
  );
}

export function CountryBadge({ country }: { country: Country }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        country === "ZA"
          ? "border-emerald-300 text-emerald-800"
          : "border-red-300 text-red-700"
      )}
    >
      <CountryFlag country={country} />
      {country === "ZA" ? "South Africa" : "Türkiye"}
    </Badge>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "gold" | "red" | "green";
}) {
  const tones = {
    default: "text-stone-700 bg-stone-100",
    gold: "text-amber-700 bg-amber-100",
    red: "text-red-700 bg-red-100",
    green: "text-emerald-700 bg-emerald-100",
  } as const;

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "rounded-lg p-2 shrink-0",
              tones[tone]
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              {label}
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-stone-900">
              {value}
            </p>
            {hint ? (
              <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">{hint}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

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
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}

export function PillarCard({
  icon: Icon,
  pillar,
  title,
  points,
  accent,
}: {
  icon: LucideIcon;
  pillar: string;
  title: string;
  points: string[];
  accent: "green" | "red";
}) {
  const accents = {
    green: {
      chip: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "bg-emerald-100 text-emerald-700",
    },
    red: {
      chip: "bg-red-50 text-red-800 border-red-200",
      icon: "bg-red-100 text-red-700",
    },
  } as const;
  const a = accents[accent];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2.5", a.icon)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p
              className={cn(
                "text-[11px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 inline-block",
                a.chip
              )}
            >
              {pillar}
            </p>
            <h3 className="mt-1 text-base font-bold text-stone-900">{title}</h3>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {points.map((p) => (
            <li
              key={p}
              className="flex gap-2 text-sm text-stone-600 leading-relaxed"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 h-1.5 w-1.5 rounded-full shrink-0",
                  accent === "green" ? "bg-emerald-500" : "bg-red-500"
                )}
              />
              {p}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
