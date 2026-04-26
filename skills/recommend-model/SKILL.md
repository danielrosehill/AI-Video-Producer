---
name: recommend-model
description: Intelligent, preference-driven model recommendation across fal.ai, Replicate, WaveSpeedAI, and MiniMax (Hailuo). Asks the user a short set of preference questions (workload, priority — quality vs speed vs cost, max budget per output, resolution/aspect/duration, NSFW tolerance, must-have features like lip-sync or audio), queries each available provider, and returns a ranked shortlist (3–5 options) with approximate per-output costs, quality/speed notes, and a recommendation. Differs from `model-researcher`: live-API backed, cost-first, and conversational about preferences.
---

# Recommend model

Conversational model picker. Use this when the user asks "what should I use for X" or "find me a cheap/good/fast model for X". For deep written research, use `model-researcher` instead.

## Step 1 — Capture preferences

Ask only the questions you don't already know from `brief/creative-brief.md`:

- **Workload**: text-to-image, text-to-video, image-to-video, lip-sync, voice/TTS, upscale, interpolate, other.
- **Priority**: quality / speed / cost (pick one as primary, one as secondary).
- **Budget ceiling**: per-output cap (e.g. "$0.20 per clip"), or "no cap, just tell me".
- **Output specs**: resolution, aspect ratio, duration (for video).
- **Hard requirements**: e.g. needs audio, needs >10s, needs lip-sync, needs photoreal faces, needs commercial license.
- **Provider preference**: fal / Replicate / WaveSpeed / MiniMax / any (default: any). Only suggest providers whose key is present in `~/.config/ai-video-producer/.env`.

Keep this short — one batched message, not five round trips. Infer from the brief where possible.

## Step 2 — Query providers

**Replicate** (use the bundled MCP):
- `mcp__plugin_ai-video-producer_replicate__search_models` with a query like the workload (`"image-to-video"`, `"lipsync"`, `"upscaler"`).
- For top hits, call `mcp__plugin_ai-video-producer_replicate__get_models` for pricing/hardware metadata, and `list_models_versions` if a specific version is needed.
- Pricing on Replicate is usually per-second of GPU time × hardware tier — convert to per-output by multiplying by typical run time stated on the model page.

**fal.ai** (hosted MCP exists for catalogue, but is thin — prefer web fetch):
- Use `WebFetch` against `https://fal.ai/models?categories=<category>` and individual model pages (e.g. `https://fal.ai/models/fal-ai/<slug>`).
- fal usually quotes per-second-of-output or per-megapixel — use what the page states.
- Execution path is `runners/fal_run.mjs` — confirm the model id matches the `fal-ai/<slug>` form the runner expects.

**WaveSpeedAI** (no MCP — catalog via web):
- `WebFetch` `https://wavespeed.ai/models` and individual model pages. Slugs follow `wavespeed-ai/<family>/<variant>` (e.g. `wavespeed-ai/z-image/turbo`).
- WaveSpeed is positioned as a fast/cheap inference platform — strong fit when the priority is speed or cost. Pricing is typically per-output, listed on each model page.
- Execution path is `runners/wavespeed_run.py`.

**MiniMax** (Hailuo video, T2A speech, music — via the bundled `minimax-mcp`):
- Tools available: `generate_video` (Hailuo, including `MiniMax-Hailuo-02` with 6s/10s @ 768P/1080P), `text_to_image`, `text_to_audio`, `voice_clone`, `voice_design`, `music_generation`.
- No catalogue browse — model selection is by tool, not by id. For video, mention the `MiniMax-Hailuo-02` option explicitly when the user is choosing a text-to-video or image-to-video model.
- Always check `query_video_generation` for async jobs.

Always record the date checked. This space changes weekly.

## Step 3 — Rank and report

Produce a compact table:

```
| Model | Provider | Approx cost/output | Quality | Speed | Notes |
```

Then a one-paragraph recommendation tied to the user's stated priority — and call out the tradeoff (e.g. "Kling 2.1 is ~3× the price of LTX but holds character identity over 10s; if you need <6s LTX is the better buy").

Cost approximates: state assumptions inline (e.g. "~$0.18 per 5s clip @ 720p, assuming the model's quoted 30s GPU time on A100"). Don't pretend to precision the providers don't give you.

## Step 4 — Persist (optional)

If the user accepts a recommendation, offer to:
- Append it to `brief/tools-and-models.md` (the canonical project-level model registry).
- Save the full shortlist to `research/recommendations-<workload>-<YYYY-MM-DD>.md` for later reference.

Don't write either file without confirmation.

## Discipline

- Don't recommend a model that requires a provider the project isn't already wired up to (no fal key configured? flag it). Same for `WAVESPEED_API_KEY` and `MINIMAX_API_KEY`.
- Per-second-of-output ≠ per-second-of-generation. Always check which the provider quotes.
- If the Replicate MCP returns a model with no public pricing (private/custom), say so — don't fabricate a number.
- For MiniMax, region matters: Global vs Mainland keys/hosts must match. If the user reports "Invalid API key", suspect a region mismatch first.
- If both providers host the same underlying model (e.g. Flux), compare proxy markups and pick the cheaper unless the more expensive one offers something concrete (faster cold start, higher rate limits).
- NSFW / commercial-use caveats: surface them, don't bury them.
