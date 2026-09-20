# 🇿🇦⇄🇹🇷 SA–Türkiye Sovereign AI & Digital Trade Sandbox

**Phase 1 Proof-of-Concept** of the *Joint South Africa–Türkiye Bilateral AI & Digital Trade Engine* — the software platform proposed by Business Hustle (Simple Eternity Holdings (Pty) Ltd) to the Directorate of Communications (Presidency of Türkiye) and the Embassy of the Republic of Türkiye, following the STRATCOM Roundtable in Johannesburg.

> One-click deploy to Vercel, then push to your GitHub — or GitHub first, Vercel second (both paths below).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## What this MVP demonstrates

| Pillar | Capability (per the approved proposal) | Where |
|---|---|---|
| **1 · Diplomatic Knowledge Hub** | Automated TR↔EN policy extraction, translation & structured **commitment tracking** powered by an LLM pipeline | `Policy Intelligence` tab → `POST /api/policy/analyze` |
| **1 · Information Integrity Engine** | **SHA-256 digest hashing + Ed25519 PKI digital signing** of press bulletins; media & citizens verify authentic state communications against AI deepfakes — verification is *stateless*, no trust in the server required | `Bulletin Verification` tab → `POST /api/bulletins`, `POST /api/verify` |
| **2 · Cross-Border Trade Matchmaker** | Semantic **cosine-similarity matching** of South African SMMEs with Turkish enterprise buyers under **AfCFTA** guidelines (MVP in-process TF-IDF vectors; pgvector in Phase 2) | `Trade Matchmaker` tab → `POST /api/trade/match` |

Also included: an executive **Overview dashboard** (live metrics, roadmap & investment framework, coalition ecosystem matrix) and a health endpoint.

## Design language

The interface is built to the standard expected of official bilateral programmes — the visual register of an international financial institution or treaty secretariat, not a consumer app:

- **Palette** — Oxford navy (`#0C2340`), antique gold (`#B08D3E`), ivory paper (`#F7F5EF`), institutional green/crimson reserved for verification verdicts and classifications.
- **Typography** — Playfair Display (display serif), Public Sans (the US federal government typeface) for UI, IBM Plex Mono for cryptographic digests.
- **Document conventions** — engraved security-paper texture, double gold rules, Roman-numeral section index, square classification stamps (`PUBLIC / MEDIA / OFFICIAL / CRISIS`), country-code chips instead of emoji flags, small-caps letterspaced labels throughout.

## Quick start (local)

```bash
bun install          # or npm install
bun run dev          # http://localhost:3000
```

The AI features work out of the box in the development sandbox. Elsewhere, configure the env vars below.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable | Required | Purpose |
|---|---|---|
| `ZAI_API_KEY` | For AI features | API key for the LLM service (Policy Intelligence) |
| `ZAI_BASE_URL` | For AI features | Base URL incl. `/v1` prefix, e.g. `https://api.example.com/v1` |
| `SANDBOX_PRIVATE_KEY` | No | Ed25519 private key (base64 DER or PEM) — overrides the demo keypair |
| `SANDBOX_PUBLIC_KEY` | No | Matching Ed25519 public key (base64 DER or PEM) |

**Without `ZAI_*` vars** the app runs fine except Policy Intelligence, which returns a clear `503 AI_UNAVAILABLE` response. **Without `SANDBOX_*` vars** a committed *demo* keypair is used — fine for the sandbox, **rotate before production** (see Security notes).

Generate a production signing pair:

```bash
node -e "const{generateKeyPairSync}=require('crypto');const{privateKey,publicKey}=generateKeyPairSync('ed25519');console.log('SANDBOX_PRIVATE_KEY='+privateKey.export({type:'pkcs8',format:'der'}).toString('base64'));console.log('SANDBOX_PUBLIC_KEY='+publicKey.export({type:'spki',format:'der'}).toString('base64'));"
```

## Deploy path A — GitHub first, then Vercel (recommended)

1. **Create an empty repo** on GitHub (e.g. `sa-tr-trade-sandbox`) — **without** README/.gitignore so it starts bare.

2. **Push this project:**

   ```bash
   cd <this-project>
   git remote add origin https://github.com/<your-username>/sa-tr-trade-sandbox.git
   git branch -M main
   git push -u origin main
   ```

3. **Import on Vercel:** <https://vercel.com/new> → pick the repo → Framework preset: **Next.js** (auto-detected) → add env vars (`ZAI_API_KEY`, `ZAI_BASE_URL`, optionally the signing keys) → **Deploy**. Zero config needed otherwise.

## Deploy path B — Vercel first (no GitHub needed yet)

```bash
npm i -g vercel
vercel login
vercel          # link & preview deploy
vercel --prod   # promote to production
vercel env add ZAI_API_KEY        # paste when prompted
vercel env add ZAI_BASE_URL
vercel --prod                     # redeploy with env vars
```

Then connect the Vercel project to a GitHub repo from its dashboard (Git → Connect) to get push-to-deploy, or push manually per Path A.

## API reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Service status + active public key & fingerprint |
| `GET` | `/api/stats` | Dashboard metrics |
| `POST` | `/api/policy/analyze` | `{ text, direction: "TR-EN" \| "EN-TR" }` → translation, summary, structured commitments, domains, risk flags |
| `GET` | `/api/bulletins` | Sealed bulletin registry |
| `POST` | `/api/bulletins` | `{ title, issuer, classification, body }` → publish + affix digital seal |
| `POST` | `/api/verify` | Stateless verification: `{ title, issuer, classification, body, publishedAt, hash, signature }` (or raw `canonical`) → `authentic` verdict |
| `GET` | `/api/trade/companies` | Registry with `?country=ZA\|TR&sector=&q=` filters |
| `POST` | `/api/trade/match` | `{ companyId }` or `{ query }` → ranked cross-corridor counterparties |

## Architecture

```
Next.js 16 (App Router) + TypeScript
├─ src/lib/pki.ts        Information Integrity Engine — SHA-256 + Ed25519 (node:crypto)
├─ src/lib/matching.ts   TF-IDF vector space + cosine similarity (pgvector upgrade path)
├─ src/lib/ai.ts         LLM wrapper w/ env-var bootstrap for serverless
├─ src/lib/store.ts      In-memory registry (stateless-friendly; re-seeds on cold start)
├─ src/lib/seed-data.ts  Demo companies + pre-sealed bulletins (self-verifying)
└─ src/app/api/*         Route handlers (see API reference)
```

**Why stateless?** Every seal is self-verifying — verification recomputes the SHA-256 digest and checks the Ed25519 signature against the public key, so the platform's core promise (information integrity) never depends on a database. Registries persist in-process per serverless instance and re-seed deterministically on cold starts.

## Security notes

- The committed keypair is **demo material**, clearly labelled. Set `SANDBOX_PRIVATE_KEY` / `SANDBOX_PUBLIC_KEY` env vars for anything real; the proposal's production design moves key custody to an isolated HSM/KMS in Phase 2.
- Company registries are **illustrative demo data** standing in for OpenTender ZA / BlackBiz / chamber registries.
- Policy analysis output is AI-generated and must be reviewed by officials before any official use.

## Phase 2 upgrade path

1. **Database** — swap `src/lib/store.ts` for PostgreSQL (e.g. Neon) with `pgvector`; replace the TF-IDF module in `src/lib/matching.ts` with embedding-based cosine similarity (`<=>` operator) — the API contract stays identical.
2. **Civic data** — live ingestion from OpenTender ZA and BlackBiz registries.
3. **Compliance** — POPIA/GDPR hardening, audit logging, multi-tenant tenancy per the approved proposal.
4. **Key custody** — HSM-backed signing service per the proposal's "Isolated HSM" infrastructure layer.
