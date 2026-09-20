"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  FileSignature,
  Loader2,
  Newspaper,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ClassificationBadge,
} from "./shared";
import type { Bulletin, BulletinClassification, VerificationResult } from "@/lib/types";

type RegistryTab = "registry" | "publish" | "verify";

interface VerifyForm {
  title: string;
  issuer: string;
  classification: string;
  body: string;
  publishedAt: string;
  hash: string;
  signature: string;
}

const EMPTY_VERIFY: VerifyForm = {
  title: "",
  issuer: "",
  classification: "PUBLIC",
  body: "",
  publishedAt: "",
  hash: "",
  signature: "",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

async function copyText(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Clipboard unavailable in this context");
  }
}

export function BulletinRegistry() {
  const [tab, setTab] = useState<RegistryTab>("registry");
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [pubTitle, setPubTitle] = useState("");
  const [pubIssuer, setPubIssuer] = useState("");
  const [pubClass, setPubClass] = useState<BulletinClassification>("PUBLIC");
  const [pubBody, setPubBody] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [verify, setVerify] = useState<VerifyForm>(EMPTY_VERIFY);
  const [verifying, setVerifying] = useState(false);
  const [verdict, setVerdict] = useState<VerificationResult | null>(null);

  const loadBulletins = useCallback(async () => {
    try {
      const res = await fetch("/api/bulletins");
      const data = await res.json();
      setBulletins(data.bulletins ?? []);
    } catch {
      toast.error("Could not load the registry.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadBulletins();
  }, [loadBulletins]);

  const publish = async () => {
    if (pubTitle.trim().length < 5 || pubIssuer.trim().length < 3 || pubBody.trim().length < 40) {
      toast.error("Title ≥ 5, issuer ≥ 3 and body ≥ 40 characters are required.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/bulletins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pubTitle,
          issuer: pubIssuer,
          classification: pubClass,
          body: pubBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Publishing failed.");
        return;
      }
      toast.success("Bulletin sealed with a digital signature.");
      setPubTitle("");
      setPubIssuer("");
      setPubBody("");
      setPubClass("PUBLIC");
      await loadBulletins();
      setTab("registry");
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const startVerify = (b: Bulletin) => {
    setVerify({
      title: b.title,
      issuer: b.issuer,
      classification: b.classification,
      body: b.body,
      publishedAt: b.publishedAt,
      hash: b.seal.hash,
      signature: b.seal.signature,
    });
    setVerdict(null);
    setTab("verify");
  };

  const runVerify = async (simulateTamper = false) => {
    const form = simulateTamper
      ? { ...verify, body: verify.body + " [unauthorised edit]" }
      : verify;
    if (!form.hash.trim() || !form.signature.trim() || !form.body.trim()) {
      toast.error("Bulletin fields, hash and signature are all required.");
      return;
    }
    setVerifying(true);
    setVerdict(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          issuer: form.issuer,
          classification: form.classification,
          body: form.body,
          publishedAt: form.publishedAt,
          hash: form.hash,
          signature: form.signature,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Verification failed.");
        return;
      }
      setVerdict(data);
      if (data.authentic && !simulateTamper) toast.success("Bulletin is authentic.");
      else toast.error(data.authentic ? "Unexpected state" : "Verification failed — see verdict.");
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const publicKey = useMemo(
    () => bulletins[0]?.seal.publicKey ?? "",
    [bulletins]
  );
  const fingerprint = useMemo(
    () => bulletins[0]?.seal.publicKeyFingerprint ?? "",
    [bulletins]
  );

  return (
    <div className="space-y-6">
      {/* Official verification key */}
      <Card className="border-hairline border-l-2 border-l-gold bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-ink">
                Official verification key — Ed25519
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Anyone can verify seals with this key — no trust in this server
                required. Fingerprint:{" "}
                <code className="bg-paper px-1 py-0.5 font-mono text-[11px] text-ink">
                  {fingerprint || "…"}
                </code>
              </p>
            </div>
            {publicKey ? (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 font-semibold uppercase tracking-[0.12em]"
                onClick={() => copyText(publicKey, "Public key")}
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Copy key
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as RegistryTab)}>
        <TabsList className="grid h-auto w-full grid-cols-3 gap-0 rounded-none border-b border-hairline bg-transparent p-0">
          <TabsTrigger value="registry" className="rounded-none border-0 border-b-2 border-transparent px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft shadow-none transition-colors hover:text-navy data-[state=active]:bg-transparent data-[state=active]:text-navy data-[state=active]:shadow-none">
            <Newspaper className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
            Registry
          </TabsTrigger>
          <TabsTrigger value="publish" className="rounded-none border-0 border-b-2 border-transparent px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft shadow-none transition-colors hover:text-navy data-[state=active]:bg-transparent data-[state=active]:text-navy data-[state=active]:shadow-none">
            <FileSignature className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
            Publish
          </TabsTrigger>
          <TabsTrigger value="verify" className="rounded-none border-0 border-b-2 border-transparent px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft shadow-none transition-colors hover:text-navy data-[state=active]:bg-transparent data-[state=active]:text-navy data-[state=active]:shadow-none">
            <ScanSearch className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
            Verify
          </TabsTrigger>
        </TabsList>

        {/* ── Registry ─────────────────────────────────────────── */}
        <TabsContent value="registry" className="mt-4 space-y-4">
          {loadingList ? (
            <Card>
              <CardContent className="p-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse bg-paper" />
                ))}
              </CardContent>
            </Card>
          ) : bulletins.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-ink-soft">
                The registry is empty — publish the first sealed bulletin.
              </CardContent>
            </Card>
          ) : (
            bulletins.map((b) => (
              <Card key={b.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="font-serif text-lg font-semibold leading-snug text-navy">
                      {b.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <ClassificationBadge value={b.classification} />
                      <BadgeCheck
                        className="h-4 w-4 text-verify"
                        aria-label="Sealed"
                      />
                    </div>
                  </div>
                  <CardDescription>
                    {b.issuer} · sealed {fmtDate(b.seal.signedAt)} (UTC)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="whitespace-pre-wrap text-sm leading-[1.8] text-ink-soft line-clamp-4">
                    {b.body}
                  </p>
                  <div className="grid gap-2 border border-hairline bg-paper p-3 text-xs">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-gold-ink">SHA-256</span>
                      <code className="break-all font-mono text-[11px] text-ink">
                        {b.seal.hash}
                      </code>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-gold-ink">
                        Ed25519 signature
                      </span>
                      <code className="break-all font-mono text-[11px] text-ink-soft">
                        {b.seal.signature.slice(0, 72)}…
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-semibold uppercase tracking-[0.12em]"
                      onClick={() => startVerify(b)}
                    >
                      <ShieldCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Verify this bulletin
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyText(
                          `${b.title}\n${b.issuer}\n${b.classification}\n\n${b.body}\n\nSHA-256: ${b.seal.hash}\nSignature: ${b.seal.signature}`,
                          "Bulletin + seal"
                        )
                      }
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Copy bulletin &amp; seal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ── Publish ──────────────────────────────────────────── */}
        <TabsContent value="publish" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold text-navy">
                Publish &amp; seal a bulletin
              </CardTitle>
              <CardDescription>
                The Information Integrity Engine computes the SHA-256 digest and
                affixes an Ed25519 digital signature at publication time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pub-title">Title</Label>
                  <Input
                    id="pub-title"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="Official announcement title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pub-issuer">Issuing authority</Label>
                  <Input
                    id="pub-issuer"
                    value={pubIssuer}
                    onChange={(e) => setPubIssuer(e.target.value)}
                    placeholder="e.g. Directorate of Communications"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pub-class">Classification</Label>
                <Select
                  value={pubClass}
                  onValueChange={(v) => setPubClass(v as BulletinClassification)}
                >
                  <SelectTrigger id="pub-class" className="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                    <SelectItem value="MEDIA">MEDIA</SelectItem>
                    <SelectItem value="OFFICIAL">OFFICIAL</SelectItem>
                    <SelectItem value="CRISIS">CRISIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pub-body">Bulletin body</Label>
                <Textarea
                  id="pub-body"
                  rows={8}
                  value={pubBody}
                  onChange={(e) => setPubBody(e.target.value)}
                  placeholder="Full press release or crisis communication text (40–10,000 characters)…"
                />
                <p className="text-xs text-ink-soft">
                  {pubBody.trim().length.toLocaleString()} / 10,000 characters
                </p>
              </div>
              <Button
                onClick={publish}
                disabled={publishing}
                className="px-5 font-bold uppercase tracking-[0.14em]"
              >
                {publishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Sealing bulletin…
                  </>
                ) : (
                  <>
                    <FileSignature className="mr-2 h-4 w-4" aria-hidden="true" />
                    Seal &amp; publish
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Verify ───────────────────────────────────────────── */}
        <TabsContent value="verify" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold text-navy">
                Verify authenticity of a communication
              </CardTitle>
              <CardDescription>
                Verification is stateless: the SHA-256 digest is recomputed and
                the Ed25519 signature checked against the official sandbox
                public key. Paste any bulletin and its seal — content that has
                been altered, deepfaked or signed by another key will fail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="v-title">Title</Label>
                  <Input
                    id="v-title"
                    value={verify.title}
                    onChange={(e) =>
                      setVerify((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-issuer">Issuer</Label>
                  <Input
                    id="v-issuer"
                    value={verify.issuer}
                    onChange={(e) =>
                      setVerify((f) => ({ ...f, issuer: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-class">Classification</Label>
                  <Input
                    id="v-class"
                    value={verify.classification}
                    onChange={(e) =>
                      setVerify((f) => ({ ...f, classification: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-date">Sealed at (ISO)</Label>
                  <Input
                    id="v-date"
                    value={verify.publishedAt}
                    onChange={(e) =>
                      setVerify((f) => ({ ...f, publishedAt: e.target.value }))
                    }
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-body">Bulletin body</Label>
                <Textarea
                  id="v-body"
                  rows={5}
                  value={verify.body}
                  onChange={(e) =>
                    setVerify((f) => ({ ...f, body: e.target.value }))
                  }
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-hash">Claimed SHA-256 digest</Label>
                <Input
                  id="v-hash"
                  value={verify.hash}
                  onChange={(e) =>
                    setVerify((f) => ({ ...f, hash: e.target.value }))
                  }
                  className="font-mono text-xs"
                  placeholder="64-character hex digest"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-sig">Ed25519 signature (base64)</Label>
                <Textarea
                  id="v-sig"
                  rows={3}
                  value={verify.signature}
                  onChange={(e) =>
                    setVerify((f) => ({ ...f, signature: e.target.value }))
                  }
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => runVerify(false)}
                  disabled={verifying}
                  className="px-5 font-bold uppercase tracking-[0.14em]"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                      Verify authenticity
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runVerify(true)}
                  disabled={verifying || !verify.body}
                  className="border-alert/40 font-semibold uppercase tracking-[0.12em] text-alert hover:bg-alert-soft hover:text-alert"
                >
                  <ShieldAlert className="mr-2 h-4 w-4" aria-hidden="true" />
                  Simulate tampering (demo)
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setVerify(EMPTY_VERIFY);
                    setVerdict(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {verdict ? (
            <Card
              className={
                verdict.authentic
                  ? "border-verify/40 border-l-4 border-l-verify bg-verify-soft/50"
                  : "border-alert/40 border-l-4 border-l-alert bg-alert-soft/50"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2.5 font-serif text-lg font-semibold text-navy">
                  {verdict.authentic ? (
                    <CheckCircle2
                      className="h-5 w-5 text-verify"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle className="h-5 w-5 text-alert" aria-hidden="true" />
                  )}
                  {verdict.authentic ? "Authentic" : "Not authentic"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium leading-relaxed text-ink">
                  {verdict.message}
                </p>
                <Separator />
                <div className="grid gap-2 text-xs sm:grid-cols-2">
                  <p className="flex items-center gap-1.5">
                    {verdict.checks.hashMatch ? (
                      <CheckCircle2 className="h-4 w-4 text-verify" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-alert" aria-hidden="true" />
                    )}
                    Digest recomputation:{" "}
                    <strong>{verdict.checks.hashMatch ? "match" : "mismatch"}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    {verdict.checks.signatureValid ? (
                      <CheckCircle2 className="h-4 w-4 text-verify" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-alert" aria-hidden="true" />
                    )}
                    Signature check:{" "}
                    <strong>{verdict.checks.signatureValid ? "valid" : "invalid"}</strong>
                  </p>
                </div>
                <div className="border border-hairline bg-paper p-3 text-[11px] font-mono leading-relaxed text-ink-soft">
                  <p>recomputed: {verdict.details.recomputedHash}</p>
                  <p>provided: {verdict.details.providedHash}</p>
                  <p>key fp: {verdict.details.publicKeyFingerprint}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
