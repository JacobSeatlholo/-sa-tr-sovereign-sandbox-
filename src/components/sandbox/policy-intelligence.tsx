"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BrainCircuit,
  FileText,
  Languages,
  ListChecks,
  Loader2,
  ScrollText,
  Tag,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_TR_POLICY } from "@/lib/overview-content";
import type { PolicyAnalysis, TranslateDirection } from "@/lib/types";

const CATEGORY_STYLE: Record<string, string> = {
  governance: "bg-stone-200 text-stone-800",
  trade: "bg-emerald-100 text-emerald-800",
  technology: "bg-amber-100 text-amber-800",
  education: "bg-red-100 text-red-800",
  security: "bg-red-100 text-red-900",
  other: "bg-stone-100 text-stone-700",
};

export function PolicyIntelligence() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<TranslateDirection>("TR-EN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolicyAnalysis | null>(null);
  const [degraded, setDegraded] = useState(false);

  const analyze = async () => {
    if (text.trim().length < 20) {
      toast.error("Please paste at least 20 characters of policy text.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/policy/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, direction }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Analysis failed.");
        return;
      }
      setResult(data.data);
      setDegraded(Boolean(data.degraded));
      if (data.degraded) {
        toast.warning("Structured parsing was limited for this input.");
      } else {
        toast.success("Policy analysis complete.");
      }
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = text.trim().length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            Diplomatic Policy Indexer
          </CardTitle>
          <CardDescription>
            Paste an official Turkish or English policy text, communiqué or
            legal gazette excerpt. The engine produces a full translation,
            executive summary, structured commitment tracking and compliance
            risk flags — powered by the sandbox LLM pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="direction">Analysis direction</Label>
              <Select
                value={direction}
                onValueChange={(v) => setDirection(v as TranslateDirection)}
              >
                <SelectTrigger id="direction" className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TR-EN">Turkish → English</SelectItem>
                  <SelectItem value="EN-TR">English → Turkish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setText(SAMPLE_TR_POLICY)}
              className="shrink-0"
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Load sample communiqué (TR)
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="policy-text">Official text</Label>
            <Textarea
              id="policy-text"
              placeholder="Paste the official policy text here… (20–8,000 characters)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p
              className={`text-xs ${
                charCount > 8000 ? "text-red-600" : "text-stone-500"
              }`}
            >
              {charCount.toLocaleString()} / 8,000 characters
            </p>
          </div>

          <Button
            onClick={analyze}
            disabled={loading || charCount < 20 || charCount > 8000}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Analysing policy…
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" aria-hidden="true" />
                Analyse &amp; translate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : null}

      {result && !loading ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ScrollText className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                English rendition
                {degraded ? (
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    degraded parse
                  </Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
                {result.translation}
              </p>
            </CardContent>
          </Card>

          {result.summary ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Executive summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-stone-700">
                  {result.summary}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {result.commitments.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  Structured commitments ({result.commitments.length})
                </CardTitle>
                <CardDescription>
                  Every obligation, actor and deadline extracted for bilateral
                  tracking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.commitments.map((c, i) => (
                  <div
                    key={`${i}-${c.commitment.slice(0, 24)}`}
                    className="rounded-lg border bg-stone-50 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          CATEGORY_STYLE[c.category] ?? CATEGORY_STYLE.other
                        }
                      >
                        {c.category}
                      </Badge>
                      {c.deadline ? (
                        <Badge
                          variant="outline"
                          className="border-amber-300 text-amber-800"
                        >
                          deadline: {c.deadline}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-800">
                      {c.commitment}
                    </p>
                    <p className="mt-1.5 text-xs text-stone-500">
                      <span className="font-semibold text-stone-600">Actor:</span>{" "}
                      {c.actor}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {result.domains.length > 0 || result.riskFlags.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {result.domains.length > 0 ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Tag className="h-4 w-4 text-amber-600" aria-hidden="true" />
                      Policy domains
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.domains.map((d) => (
                      <Badge
                        key={d}
                        variant="outline"
                        className="border-emerald-300 text-emerald-800"
                      >
                        {d}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ) : null}
              {result.riskFlags.length > 0 ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle
                        className="h-4 w-4 text-red-600"
                        aria-hidden="true"
                      />
                      Risk flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-3" />
                    <ul className="space-y-2">
                      {result.riskFlags.map((r) => (
                        <li
                          key={r}
                          className="flex gap-2 text-sm text-stone-700 leading-relaxed"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
