# AI Video Producer

A Claude Code plugin that drives the end-to-end lifecycle of a single AI-generated video project: creative brief → model selection → character sheets → script → storyboard → generation pipelines → clip assembly → post-production → final export.

This is a **state-aware lifecycle** plugin — it operates inside a per-project workspace it scaffolds itself. Distinct from utility-belt plugins that fire stateless one-off operations on media files.

## What's in the box

### Commands

- `/install-video-workspace` — scaffold the per-project folder structure + project CLAUDE.md into the current directory.
- `/setup-credentials` — one-time setup for fal.ai + Replicate API keys. Writes `~/.config/ai-video-producer/.env` and wires it into your shell profile so the bundled MCP servers always have keys.
- `/onboard` — capture the creative brief and tools-and-models selection.
- `/define-character` — add a recurring character/subject sheet.
- `/draft-script` — produce a script draft from the brief.
- `/storyboard` — break the locked script into a numbered shot list with per-shot briefs.
- `/run-pipeline <name> <shot#>` — execute a predefined pipeline for a shot.
- `/log-take <path>` — record a generated artefact's prompt, model, parameters, and cost.
- `/promote-take <path>` — copy a raw take into `clips/selected/` with rationale.
- `/assemble` — propose an ffmpeg edit plan to concatenate clips into a rough cut.
- `/export-final` — encode the locked draft to spec, embed subtitles, write to `output/final/`.

### Agents

Spawned via the `Task` tool when a job warrants a dedicated subagent.

- `script-writer` — drafts and revises scripts from the brief; iterates with the user; promotes a chosen draft to `scripts/final/script.md`.
- `pipeline-scaffolder` — designs a new pipeline as a structured `SPEC.md` (planning only; no code).
- `pipeline-builder` — converts an approved SPEC into runnable per-stage runners.
- `pipeline-repo-setup` — provisions a private GitHub repo for versioning reusable pipelines across projects.
- `concatenator` — joins clip elements into a single render. GPU-aware (NVENC / AMF / VAAPI / QSV / CPU). Picks fast-path (concat-demuxer) vs safe-path (re-encode).
- `normalizer` — equalises loudness (EBU R128, two-pass), conforms framerate / pixel format / colour tag, writes to `clips/normalised/`.
- `aspect-converter` — aspect ratio conversion (16:9 ↔ 9:16, blur-fill / letterbox / smart-crop) and resolution upscaling. GPU-aware. Defers to AI-upscale skills when ≥2× uplift is needed.

### Skills

Pipeline recipes:

- `text-to-image-to-video` — Flux/SDXL/Imagen → Kling/Runway/Hailuo.
- `voice-to-lip-sync` — voice generation → lip-sync.
- `text-to-video-direct` — single-step text-to-video.
- `upscale-and-interpolate` — resolution + frame-rate uplift.
- `video-workspace-conventions` — reference for the workspace layout.

Production utilities:

- `script-to-tts` — reformat a finished script for a specific TTS model (ElevenLabs, OpenAI, Google, Azure, Hume, Chatterbox), with model-appropriate SSML / pacing / chunking.
- `model-researcher` — research current fal/Replicate (and direct-provider) offerings for a workload; recommend a best-fit model with rationale; update `brief/tools-and-models.md`.
- `budget-estimator` — project API cost (low / typical / high) for a pipeline or whole script before any generation runs.
- `comfyui-import` — turn a ComfyUI workflow JSON into a pipeline SPEC + stage runners (with custom-node + checkpoint manifest).
- `comfyui-export` — turn a pipeline SPEC into a ComfyUI API-format workflow JSON for local execution; flag stages that have no clean local equivalent.

## Bundled MCP servers

The plugin ships with two MCP servers preconfigured (see `.mcp.json`):

- **fal-ai** — hosted at `https://mcp.fal.ai/mcp` (HTTP transport, requires `FAL_KEY`).
- **replicate** — local stdio via `npx -y replicate-mcp` (requires `REPLICATE_API_TOKEN`).

Credentials live in `~/.config/ai-video-producer/.env`. The `/setup-credentials` command creates that file and adds a loader line to your shell profile so every shell that launches Claude Code has the values in its environment. See `.env.example` for the full template.

## Typical workflow

```
mkdir my-video-project && cd my-video-project
claude
> /setup-credentials               # once per machine
> /install-video-workspace
> /onboard
> /define-character
> /draft-script                    # or spawn the script-writer agent
> /storyboard
> /run-pipeline text-to-image-to-video 01
> /promote-take clips/raw/01-establishing-v3.mp4
... repeat for each shot ...
> /assemble                        # rough cut
... or spawn `normalizer` → `concatenator` → `aspect-converter` for finer control ...
> /export-final
```

## Recommended companion plugins

- **video-editing** — ffmpeg utilities (transcode, watermark, merge) for ad-hoc clip work.
- **video-production** — ComfyUI workspace management and cover-art generation.

## Required external tools

- **ffmpeg** (system binary) — used by `concatenator`, `normalizer`, `aspect-converter`, `/assemble`, `/export-final`.
- **gh** (authenticated) — used by `pipeline-repo-setup`.
- **GPU drivers** — NVIDIA (CUDA + NVENC), AMD (ROCm + AMF/VAAPI), or Intel (QSV/VAAPI). Optional; CPU encoding is the fallback.

## Installation

```bash
claude plugins install ai-video-producer@danielrosehill
```

## License

MIT
