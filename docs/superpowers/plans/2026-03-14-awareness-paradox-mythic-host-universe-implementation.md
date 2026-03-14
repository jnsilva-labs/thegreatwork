# Awareness Paradox Mythic Host Universe Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a file-backed mythic-host content operating system that lets Awareness Paradox generate, review, produce, and export AI-driven TikTok/YouTube assets from one structured queue.

**Architecture:** Keep the MVP local-first and simple. Store the editorial canon and content queue as JSON under `content/mythic-host/`, validate them with Zod in `src/lib/mythicHost/`, and run the workflow through TypeScript scripts in `scripts/mythic-host/`. Human approvals happen through generated HTML review packets and status updates in the queue. Publishing starts as ready-to-post export bundles rather than direct platform API posting.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zod, Vitest, Node `fetch`, file-backed JSON storage, ElevenLabs, HeyGen, Runway, Higgsfield, optional OpenAI-compatible LLM, `ffmpeg` for first-pass assembly.

---

Source design: `docs/superpowers/specs/2026-03-14-awareness-paradox-mythic-host-universe-design.md`

## File Structure

### Content and output state

- Create: `content/mythic-host/canon.json`
  - Editorial canon: source texts, tone rules, visual rules, recurring themes, avoid list, current campaign focus.
- Create: `content/mythic-host/queue.json`
  - Canonical queue for ideas, scripts, approvals, provider jobs, and publish status.
- Create: `content/mythic-host/README.md`
  - Documents the local workflow and JSON file responsibilities.
- Create: `output/mythic-host/.gitkeep`
  - Keeps the generated output root in place for review packets, voice files, renders, and publish bundles.

### Shared TypeScript domain layer

- Create: `src/lib/mythicHost/schema.ts`
  - Zod schemas and exported TypeScript types for canon, queue items, provider jobs, render manifests, and publish bundles.
- Create: `src/lib/mythicHost/constants.ts`
  - Path constants, status enums, environment keys, approved pillar/world names.
- Create: `src/lib/mythicHost/store.ts`
  - Read/write helpers for canon and queue plus deterministic ID generation and founder-priority insertion.
- Create: `src/lib/mythicHost/promptPacks.ts`
  - Canon-aware prompt builders for ideas, scripts, shot plans, and platform metadata.
- Create: `src/lib/mythicHost/ideation.ts`
  - LLM orchestration for batch idea generation and script drafting with manual fallback.
- Create: `src/lib/mythicHost/reviewPacket.ts`
  - HTML generation for script-review and final-review packets.
- Create: `src/lib/mythicHost/providers/llm.ts`
  - Provider-agnostic text generation wrapper, defaulting to an OpenAI-compatible endpoint when configured.
- Create: `src/lib/mythicHost/providers/elevenlabs.ts`
  - Voice job submit + artifact persistence.
- Create: `src/lib/mythicHost/providers/heygen.ts`
  - Direct-to-camera host job submit + status normalization.
- Create: `src/lib/mythicHost/providers/runway.ts`
  - Cinematic insert job submit + status normalization.
- Create: `src/lib/mythicHost/providers/higgsfield.ts`
  - Alternate cinematic insert job submit + status normalization.
- Create: `src/lib/mythicHost/production.ts`
  - Orchestrates approved scripts into voice jobs, shot jobs, and normalized asset manifests.
- Create: `src/lib/mythicHost/assembly.ts`
  - Builds `ffmpeg` manifests and renders first-pass shorts from approved assets.
- Create: `src/lib/mythicHost/publishBundle.ts`
  - Generates titles, descriptions, tags, thumbnail text, and ready-to-post bundle metadata.

### Scripts

- Create: `scripts/mythic-host/generate-ideas.ts`
  - Appends generated or founder-seeded ideas/scripts into the queue.
- Create: `scripts/mythic-host/build-review-packets.ts`
  - Emits script-review or final-review HTML files into `output/mythic-host/review/`.
- Create: `scripts/mythic-host/update-status.ts`
  - Batch-updates queue items for script approval, render approval, rejection, and publish transitions.
- Create: `scripts/mythic-host/generate-assets.ts`
  - Runs voice generation and provider job submission for script-approved items.
- Create: `scripts/mythic-host/render-first-pass.ts`
  - Polls completed assets and assembles first-pass MP4 outputs.
- Create: `scripts/mythic-host/export-publish-bundles.ts`
  - Creates ready-to-post folders for approved renders.

### Tests

- Create: `src/test/mythic-host.schema.test.ts`
- Create: `src/test/mythic-host.store.test.ts`
- Create: `src/test/mythic-host.ideation.test.ts`
- Create: `src/test/mythic-host.review-packet.test.ts`
- Create: `src/test/mythic-host.production.test.ts`
- Create: `src/test/mythic-host.publish-bundle.test.ts`

### Existing files to modify

- Modify: `package.json`
  - Add `mythic:*` scripts for the operator workflow.
- Modify: `.env.example`
  - Add environment variables for LLM, ElevenLabs, HeyGen, Runway, Higgsfield, and `ffmpeg`.
- Modify: `README.md`
  - Add one short section linking to the mythic-host workflow docs.
- Create: `docs/ops/2026-03-14-mythic-host-ops-runbook.md`
  - Human runbook for batching scripts, reviewing output, and exporting bundles.

## Implementation Decisions

- Keep storage file-based in v1. Do not add a database or CMS before the workflow proves itself.
- Keep the queue in one JSON file until scale pain appears. Do not shard records prematurely.
- Treat direct platform posting as a later upgrade. The MVP output is a ready-to-post bundle with final MP4, caption variants, title variants, and hashtags/tags.
- Support founder-injected topics as first-class queue items with higher default priority than system-generated ideas.
- Use one locked Hermes voice profile in ElevenLabs.
- Use the three approved worlds only: `observatory`, `laboratory`, `archive`.
- Keep all provider integrations behind small adapters so one provider can be swapped without touching the queue model.

## Chunk 1: Foundation And Editorial State

### Task 1: Create the canon and queue schema

**Files:**
- Create: `src/lib/mythicHost/schema.ts`
- Create: `src/test/mythic-host.schema.test.ts`
- Create: `content/mythic-host/canon.json`
- Create: `content/mythic-host/queue.json`

- [ ] **Step 1: Write the failing schema test**

```ts
import { describe, expect, it } from "vitest";
import { MythicCanonSchema, MythicQueueSchema } from "@/lib/mythicHost/schema";

describe("Mythic host schemas", () => {
  it("accepts the base canon", () => {
    const result = MythicCanonSchema.safeParse({
      version: 1,
      currentFocus: "Launch mythic-host shorts",
      sourceTexts: ["Corpus Hermeticum", "Emerald Tablet"],
      recurringThemes: ["initiation", "transmutation"],
      recurringPhrases: ["remember who you are"],
      toneRules: ["wise without camp"],
      visualRules: ["realism first, myth second"],
      avoid: ["generic wizard aesthetics"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects queue items without approval state", () => {
    const result = MythicQueueSchema.safeParse({
      version: 1,
      items: [{ id: "mh_0001", pillar: "initiation" }],
    });

    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.schema.test.ts`

Expected: FAIL with module or schema export errors.

- [ ] **Step 3: Implement the schemas and seed files**

```ts
import { z } from "zod";

export const MythicPillarSchema = z.enum(["initiation", "revelation", "transmission"]);
export const MythicWorldSchema = z.enum(["observatory", "laboratory", "archive"]);
export const ApprovalStageSchema = z.enum(["pending", "approved", "rejected"]);

export const MythicQueueItemSchema = z.object({
  id: z.string(),
  origin: z.enum(["system", "founder", "market_signal"]),
  priority: z.number().int().min(0).max(100),
  pillar: MythicPillarSchema,
  topic: z.string(),
  sourceAnchor: z.string(),
  hook: z.string(),
  script: z.string().default(""),
  visualWorld: MythicWorldSchema,
  approval: z.object({
    script: ApprovalStageSchema,
    render: ApprovalStageSchema,
  }),
  publishStatus: z.enum(["queued", "bundled", "posted"]).default("queued"),
});

export const MythicQueueSchema = z.object({
  version: z.literal(1),
  items: z.array(MythicQueueItemSchema),
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/mythic-host.schema.test.ts`

Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mythicHost/schema.ts src/test/mythic-host.schema.test.ts content/mythic-host/canon.json content/mythic-host/queue.json
git commit -m "feat: add mythic host content schemas"
```

### Task 2: Add the file-backed store and founder-priority insertion

**Files:**
- Create: `src/lib/mythicHost/constants.ts`
- Create: `src/lib/mythicHost/store.ts`
- Create: `src/test/mythic-host.store.test.ts`
- Create: `content/mythic-host/README.md`
- Create: `output/mythic-host/.gitkeep`

- [ ] **Step 1: Write the failing store test**

```ts
import { describe, expect, it } from "vitest";
import { insertQueueItems } from "@/lib/mythicHost/store";

describe("insertQueueItems", () => {
  it("places founder items ahead of system items by default", () => {
    const next = insertQueueItems(
      [{ id: "sys", origin: "system", priority: 40 }, { id: "new", origin: "founder", priority: 50 }],
      []
    );

    expect(next[0]?.id).toBe("new");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.store.test.ts`

Expected: FAIL with missing store helper exports.

- [ ] **Step 3: Implement the store helpers**

```ts
export function insertQueueItems(existing: MythicQueueItem[], incoming: MythicQueueItem[]) {
  return [...existing, ...incoming].sort((a, b) => {
    if (a.origin === "founder" && b.origin !== "founder") return -1;
    if (b.origin === "founder" && a.origin !== "founder") return 1;
    return b.priority - a.priority;
  });
}
```

- [ ] **Step 4: Add content-path constants and local workflow README**

Run: `mkdir -p content/mythic-host output/mythic-host`

Expected: directories exist for queue state and generated assets.

- [ ] **Step 5: Run tests to verify store behavior**

Run: `npx vitest run src/test/mythic-host.store.test.ts src/test/mythic-host.schema.test.ts`

Expected: PASS with all mythic-host tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mythicHost/constants.ts src/lib/mythicHost/store.ts src/test/mythic-host.store.test.ts content/mythic-host/README.md output/mythic-host/.gitkeep
git commit -m "feat: add mythic host file store"
```

## Chunk 2: Ideation, Scripting, And Review

### Task 3: Build canon-aware idea and script generation

**Files:**
- Create: `src/lib/mythicHost/promptPacks.ts`
- Create: `src/lib/mythicHost/providers/llm.ts`
- Create: `src/lib/mythicHost/ideation.ts`
- Create: `src/test/mythic-host.ideation.test.ts`
- Create: `scripts/mythic-host/generate-ideas.ts`
- Modify: `.env.example`
- Modify: `package.json`

- [ ] **Step 1: Write the failing ideation test**

```ts
import { describe, expect, it } from "vitest";
import { buildScriptPrompt } from "@/lib/mythicHost/promptPacks";

describe("buildScriptPrompt", () => {
  it("includes canon constraints and one-core-insight structure", () => {
    const prompt = buildScriptPrompt({
      topic: "Nigredo",
      visualWorld: "laboratory",
      sourceAnchor: "Rosarium Philosophorum",
    });

    expect(prompt).toContain("one core insight");
    expect(prompt).toContain("realism first, myth second");
    expect(prompt).toContain("laboratory");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.ideation.test.ts`

Expected: FAIL with missing prompt builder.

- [ ] **Step 3: Implement prompt packs and provider wrapper**

```ts
export function buildScriptPrompt(input: ScriptPromptInput) {
  return [
    "Write one short-form mythic host script.",
    "Use this structure: Hook -> world entry -> one core insight -> memorable closing line.",
    "Honor these visual rules: realism first, myth second.",
    `World: ${input.visualWorld}`,
    `Source anchor: ${input.sourceAnchor}`,
    `Topic: ${input.topic}`,
  ].join("\n");
}
```

- [ ] **Step 4: Add CLI workflow scripts**

Modify `package.json` to add:

```json
"mythic:ideas": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/generate-ideas.ts"
```

Expected: `package.json` now exposes a repeatable ideation command.

- [ ] **Step 5: Re-run ideation tests**

Run: `npx vitest run src/test/mythic-host.ideation.test.ts src/test/mythic-host.store.test.ts`

Expected: PASS with prompt and queue composition covered.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mythicHost/promptPacks.ts src/lib/mythicHost/providers/llm.ts src/lib/mythicHost/ideation.ts src/test/mythic-host.ideation.test.ts scripts/mythic-host/generate-ideas.ts package.json .env.example
git commit -m "feat: add mythic host ideation pipeline"
```

### Task 4: Generate review packets and lightweight approvals

**Files:**
- Create: `src/lib/mythicHost/reviewPacket.ts`
- Create: `src/test/mythic-host.review-packet.test.ts`
- Create: `scripts/mythic-host/build-review-packets.ts`
- Create: `scripts/mythic-host/update-status.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing review-packet test**

```ts
import { describe, expect, it } from "vitest";
import { buildReviewPacketHtml } from "@/lib/mythicHost/reviewPacket";

describe("buildReviewPacketHtml", () => {
  it("renders queue items into a readable approval packet", () => {
    const html = buildReviewPacketHtml({
      stage: "script",
      items: [{ id: "mh_0001", topic: "Emerald Tablet", hook: "Most people misread 'as above, so below'." }],
    });

    expect(html).toContain("mh_0001");
    expect(html).toContain("Emerald Tablet");
    expect(html).toContain("<html");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.review-packet.test.ts`

Expected: FAIL with missing HTML packet builder.

- [ ] **Step 3: Implement packet generation and status-updater CLI**

```ts
export function buildReviewPacketHtml(input: ReviewPacketInput) {
  const cards = input.items.map((item) => `<article><h2>${item.id} — ${item.topic}</h2><p>${item.hook}</p></article>`).join("");
  return `<!doctype html><html><body><main><h1>${input.stage} review</h1>${cards}</main></body></html>`;
}
```

- [ ] **Step 4: Add the review commands**

Modify `package.json` to add:

```json
"mythic:review": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/build-review-packets.ts",
"mythic:status": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/update-status.ts"
```

Expected: operators can generate review pages and apply approvals without editing JSON by hand.

- [ ] **Step 5: Re-run review tests and generate a sample packet**

Run: `npx vitest run src/test/mythic-host.review-packet.test.ts && npm run mythic:review -- --stage script`

Expected: tests pass and `output/mythic-host/review/script-review.html` is created.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mythicHost/reviewPacket.ts src/test/mythic-host.review-packet.test.ts scripts/mythic-host/build-review-packets.ts scripts/mythic-host/update-status.ts package.json
git commit -m "feat: add mythic host review workflow"
```

## Chunk 3: Production, Assembly, And Publish Bundles

### Task 5: Add provider adapters and normalized asset orchestration

**Files:**
- Create: `src/lib/mythicHost/providers/elevenlabs.ts`
- Create: `src/lib/mythicHost/providers/heygen.ts`
- Create: `src/lib/mythicHost/providers/runway.ts`
- Create: `src/lib/mythicHost/providers/higgsfield.ts`
- Create: `src/lib/mythicHost/production.ts`
- Create: `src/test/mythic-host.production.test.ts`
- Create: `scripts/mythic-host/generate-assets.ts`
- Modify: `.env.example`
- Modify: `package.json`

- [ ] **Step 1: Write the failing production test**

```ts
import { describe, expect, it } from "vitest";
import { buildProductionPlan } from "@/lib/mythicHost/production";

describe("buildProductionPlan", () => {
  it("creates one voice job and one visual job set per approved script", () => {
    const plan = buildProductionPlan({
      id: "mh_0001",
      visualWorld: "archive",
      approval: { script: "approved", render: "pending" },
    });

    expect(plan.voice.provider).toBe("elevenlabs");
    expect(plan.visualJobs.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.production.test.ts`

Expected: FAIL with missing production planner.

- [ ] **Step 3: Implement normalized provider clients and production planner**

```ts
export function buildProductionPlan(item: MythicQueueItem) {
  return {
    voice: { provider: "elevenlabs", voiceKey: "hermes_v1", itemId: item.id },
    visualJobs: [
      { provider: "heygen", role: "host_take", itemId: item.id },
      { provider: "runway", role: "cinematic_insert", itemId: item.id },
    ],
  };
}
```

- [ ] **Step 4: Add the asset-generation command**

Modify `package.json` to add:

```json
"mythic:produce": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/generate-assets.ts"
```

Expected: a single command can submit or simulate the approved production batch.

- [ ] **Step 5: Re-run production tests**

Run: `npx vitest run src/test/mythic-host.production.test.ts src/test/mythic-host.ideation.test.ts`

Expected: PASS with the provider-neutral orchestration covered.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mythicHost/providers/elevenlabs.ts src/lib/mythicHost/providers/heygen.ts src/lib/mythicHost/providers/runway.ts src/lib/mythicHost/providers/higgsfield.ts src/lib/mythicHost/production.ts src/test/mythic-host.production.test.ts scripts/mythic-host/generate-assets.ts package.json .env.example
git commit -m "feat: add mythic host production adapters"
```

### Task 6: Render first-pass videos and export publish bundles

**Files:**
- Create: `src/lib/mythicHost/assembly.ts`
- Create: `src/lib/mythicHost/publishBundle.ts`
- Create: `src/test/mythic-host.publish-bundle.test.ts`
- Create: `scripts/mythic-host/render-first-pass.ts`
- Create: `scripts/mythic-host/export-publish-bundles.ts`
- Create: `docs/ops/2026-03-14-mythic-host-ops-runbook.md`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write the failing publish-bundle test**

```ts
import { describe, expect, it } from "vitest";
import { buildPublishBundle } from "@/lib/mythicHost/publishBundle";

describe("buildPublishBundle", () => {
  it("creates platform variants for TikTok and YouTube Shorts", () => {
    const bundle = buildPublishBundle({
      id: "mh_0001",
      topic: "Nigredo",
      hook: "If life feels like it is falling apart, the alchemists had a name for that.",
    });

    expect(bundle.platforms.tiktok.caption).toContain("Nigredo");
    expect(bundle.platforms.youtubeShorts.title.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/mythic-host.publish-bundle.test.ts`

Expected: FAIL with missing bundle builder.

- [ ] **Step 3: Implement assembly and bundle export**

```ts
export function buildPublishBundle(input: PublishBundleInput) {
  return {
    id: input.id,
    platforms: {
      tiktok: { caption: `${input.topic} | Awareness Paradox`, hashtags: ["#alchemy", "#hermes"] },
      youtubeShorts: { title: input.topic, description: input.hook },
    },
  };
}
```

- [ ] **Step 4: Add render/export commands and operator docs**

Modify `package.json` to add:

```json
"mythic:render": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/render-first-pass.ts",
"mythic:bundle": "node -r ts-node/register -r tsconfig-paths/register scripts/mythic-host/export-publish-bundles.ts"
```

Expected: the full operator loop is now scriptable end to end.

- [ ] **Step 5: Run the focused test suite, lint, and build**

Run: `npx vitest run src/test/mythic-host.schema.test.ts src/test/mythic-host.store.test.ts src/test/mythic-host.ideation.test.ts src/test/mythic-host.review-packet.test.ts src/test/mythic-host.production.test.ts src/test/mythic-host.publish-bundle.test.ts`

Expected: PASS with all mythic-host tests green.

Run: `npm run lint -- src/lib/mythicHost scripts/mythic-host src/test/mythic-host.*`

Expected: no lint errors in the new workflow.

Run: `npm run build`

Expected: Next.js build completes successfully.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mythicHost/assembly.ts src/lib/mythicHost/publishBundle.ts src/test/mythic-host.publish-bundle.test.ts scripts/mythic-host/render-first-pass.ts scripts/mythic-host/export-publish-bundles.ts docs/ops/2026-03-14-mythic-host-ops-runbook.md README.md package.json
git commit -m "feat: add mythic host publish bundles"
```

## Execution Order

1. Complete Chunk 1 to lock the schema and storage model.
2. Complete Chunk 2 to make ideas, scripts, and approvals operational.
3. Complete Chunk 3 to turn approved scripts into rendered drafts and publish bundles.

## Acceptance Checklist

- The repo contains one canonical mythic-host canon file and one canonical queue file.
- Founder-injected ideas can be added without hand-editing queue structure.
- Batch idea generation produces queue records that honor canon rules.
- Script-review and final-review HTML packets can be generated locally.
- Approved scripts can trigger voice and visual production jobs through normalized adapters.
- First-pass MP4 renders can be assembled locally when provider assets exist.
- Publish bundles can be exported with TikTok and YouTube Shorts metadata.
- The new workflow is documented in an ops runbook.
- Tests, lint, and build pass before claiming completion.

## Risks To Watch During Execution

- If provider APIs differ from assumptions, keep the queue schema stable and adjust only the adapter layer.
- If `ffmpeg` is unavailable locally, fail with a clear prerequisite message instead of silently skipping assembly.
- If JSON queue churn becomes painful, stop after MVP and migrate to one-file-per-item only with evidence.
- If prompt outputs start sounding generic, tighten canon inputs before adding more automation.

## Ready Slice

Start with Chunk 1 only if you want the fastest proof of direction. It gives you a real canon, a real queue, and a durable base for every later automation step.
