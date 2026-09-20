"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Filter,
  Handshake,
  Loader2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CountryBadge } from "./shared";
import type { Company, MatchResult } from "@/lib/types";

type Mode = "registry" | "need";

export function TradeMatchmaker() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [mode, setMode] = useState<Mode>("registry");
  const [selectedId, setSelectedId] = useState<string>("");
  const [needText, setNeedText] = useState("");
  const [matching, setMatching] = useState(false);
  const [source, setSource] = useState<Company | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    fetch("/api/trade/companies")
      .then((r) => r.json())
      .then((d) => setCompanies(d.companies ?? []))
      .catch(() => toast.error("Could not load the company registry."))
      .finally(() => setLoadingList(false));
  }, []);

  const sectors = useMemo(
    () => [...new Set(companies.map((c) => c.sector))].sort(),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((c) => {
      if (countryFilter !== "all" && c.country !== countryFilter) return false;
      if (sectorFilter !== "all" && c.sector !== sectorFilter) return false;
      if (
        q &&
        !`${c.name} ${c.city} ${c.sector} ${c.description}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [companies, countryFilter, sectorFilter, search]);

  const runMatch = async () => {
    const payload =
      mode === "registry"
        ? { companyId: selectedId }
        : { query: needText };
    if (mode === "registry" && !selectedId) {
      toast.error("Select a company to match from.");
      return;
    }
    if (mode === "need" && needText.trim().length < 5) {
      toast.error("Describe your trade need (at least 5 characters).");
      return;
    }
    setMatching(true);
    setSource(null);
    setMatches([]);
    try {
      const res = await fetch("/api/trade/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Matching failed.");
        return;
      }
      setSource(data.source);
      setMatches(data.matches);
      toast.success(`${data.matches.length} counterparties ranked.`);
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Matcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 font-serif text-lg font-semibold text-navy">
            <Handshake className="h-5 w-5 text-navy-mid" aria-hidden="true" strokeWidth={1.75} />
            Cross-Border SMME Matchmaker
          </CardTitle>
          <CardDescription>
            Semantic vector search ranks counterparties across the SA ↔ TR
            corridor using cosine similarity over capability profiles, framed
            by AfCFTA trade guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={mode === "registry" ? "default" : "outline"}
              className="font-semibold uppercase tracking-[0.12em]"
              onClick={() => setMode("registry")}
            >
              Match from registry
            </Button>
            <Button
              size="sm"
              variant={mode === "need" ? "default" : "outline"}
              className="font-semibold uppercase tracking-[0.12em]"
              onClick={() => setMode("need")}
            >
              Post a trade need
            </Button>
          </div>

          {mode === "registry" ? (
            <div className="space-y-1.5">
              <Label htmlFor="match-company">Source company</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="match-company" className="w-full">
                  <SelectValue placeholder="Select a South African supplier or Turkish buyer…" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.country} — {c.name} ({c.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="match-need">Your trade need</Label>
              <Textarea
                id="match-need"
                rows={4}
                value={needText}
                onChange={(e) => setNeedText(e.target.value)}
                placeholder="e.g. We are a Turkish food manufacturer seeking reliable African suppliers of dried fruit and botanical extracts for EU re-export…"
              />
            </div>
          )}

          <Button
            onClick={runMatch}
            disabled={matching}
            className="px-5 font-bold uppercase tracking-[0.14em]"
          >
            {matching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Computing semantic matches…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Find counterparties
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {matching ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : null}

      {!matching && matches.length > 0 ? (
        <div className="space-y-4">
          <div className="border border-hairline border-l-2 border-l-gold bg-card p-4">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-ink">
              Ranked counterparties
            </p>
            <p className="mt-1.5 text-sm font-semibold text-navy">
              {source ? (
                <>
                  {source.name}
                  <span className="ml-1.5 font-normal text-ink-soft">
                    ({source.countryName} · {source.sector})
                  </span>
                </>
              ) : (
                <>For your posted trade need</>
              )}
            </p>
          </div>
          {matches.map((m, i) => (
            <Card key={m.company.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Rank + score */}
                  <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-center sm:gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center border font-serif text-lg font-semibold ${
                        i === 0
                          ? "border-gold bg-gold text-navy-deep"
                          : "border-hairline bg-paper text-navy-mid"
                      }`}
                      aria-label={`Rank ${i + 1}`}
                    >
                      {i + 1}
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-2xl font-semibold tabular-nums leading-none text-navy">
                        {m.score}
                        <span className="font-sans text-xs font-medium text-ink-soft">/100</span>
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                        Similarity
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CountryBadge country={m.company.country} />
                      <Badge variant="secondary" className="capitalize">
                        {m.company.role}
                      </Badge>
                      {m.sectorOverlap ? (
                        <span className="border border-verify/40 bg-verify-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-verify">
                          Sector match
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold text-navy">
                      {m.company.name}
                    </h3>
                    <p className="text-xs text-ink-soft">
                      {m.company.city} · {m.company.sector} · {m.company.employees} employees
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {m.company.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.matchedTerms.slice(0, 8).map((t) => (
                        <span
                          key={t}
                          className="border border-hairline bg-paper px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-navy"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
                      <ArrowRight className="h-3.5 w-3.5 text-gold-ink" aria-hidden="true" />
                      {m.rationale}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.company.certifications.map((cert) => (
                        <Badge
                          key={cert}
                          variant="outline"
                          className="text-[10px] uppercase tracking-[0.08em] text-ink-soft"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Directory */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2.5 font-serif text-lg font-semibold text-navy">
              <Building2 className="h-5 w-5 text-navy-mid" aria-hidden="true" strokeWidth={1.75} />
              Verified registry (demo data)
            </h3>
            <p className="mt-1 text-xs text-ink-soft">
              Illustrative Phase 1 entries — live OpenTender ZA / BlackBiz
              integration arrives in Phase 2.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search registry…"
                className="pl-8 sm:w-44"
                aria-label="Search companies"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full sm:w-36" aria-label="Filter by country">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                <SelectItem value="ZA">ZA — South Africa</SelectItem>
                <SelectItem value="TR">TR — Türkiye</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter by sector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loadingList ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <CountryBadge country={c.country} />
                    <Badge variant="secondary" className="capitalize text-[11px]">
                      {c.role}
                    </Badge>
                  </div>
                  <h4 className="mt-2 font-serif text-[15px] font-semibold text-navy">{c.name}</h4>
                  <p className="text-xs text-ink-soft">
                    {c.city} · {c.sector}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-soft">
                    {c.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.capabilities.slice(0, 3).map((cap) => (
                      <Badge
                        key={cap}
                        variant="outline"
                        className="text-[10px] text-ink-soft"
                      >
                        {cap}
                      </Badge>
                    ))}
                    {c.capabilities.length > 3 ? (
                      <Badge variant="outline" className="text-[10px] text-ink-soft">
                        +{c.capabilities.length - 3}
                      </Badge>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-ink-soft">
                No registry entries match the current filters.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
