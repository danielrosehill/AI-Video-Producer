# AI Video Production Lifecycle

A Claude Code plugin that drives the end-to-end lifecycle of a single AI-generated video project: creative brief → model selection → character sheets → script → storyboard → generation pipelines → clip assembly → final export.

This is a **state-aware lifecycle** plugin — it operates inside a per-project workspace it scaffolds itself. Distinct from utility-belt plugins that fire stateless one-off operations on media files.

## What's in the box

### Commands

- `/install-video-workspace` — scaffold the per-project folder structure + project CLAUDE.md into the current directory. Run this once when starting a new video project.
- `/onboard` — capture the creative brief and tools-and-models selection.
- `/define-character` — add a recurring character/subject sheet.
- `/draft-script` — produce a script draft from the brief.
- `/storyboard` — break the locked script into a numbered shot list with per-shot briefs.
- `/run-pipeline <name> <shot#>` — execute a predefined pipeline for a shot.
- `/log-take <path>` — record a generated artefact's prompt, model, parameters, and cost.
- `/promote-take <path>` — copy a raw take into `clips/selected/` with rationale.
- `/assemble` — propose an ffmpeg edit plan to concatenate clips into a rough cut.
- `/export-final` — encode the locked draft to spec, embed subtitles, write to `output/final/`.

### Skills (pipeline recipes)

- `text-to-image-to-video` — Flux/SDXL/Imagen → Kling/Runway/Hailuo. Best for shots needing tight visual control before motion.
- `voice-to-lip-sync` — ElevenLabs (or similar) voice generation → lip-sync model. For talking-head shots.
- `text-to-video-direct` — Single-step text-to-video (Sora, Veo, Kling, Hailuo). For exploratory or B-roll shots.
- `upscale-and-interpolate` — Post-processing chain for resolution and frame-rate uplift.
- `video-workspace-conventions` — Reference for the workspace layout and conventions.

## Typical workflow

```
mkdir my-video-project && cd my-video-project
claude
> /install-video-workspace
> /onboard
> /define-character
> /draft-script
> /storyboard
> /run-pipeline text-to-image-to-video 01
> /promote-take clips/raw/01-establishing-v3.mp4
... repeat for each shot ...
> /assemble
> /export-final
```

## Recommended companion plugins

- **video-editing** — ffmpeg utilities (transcode, watermark, merge) you may want for ad-hoc clip work.
- **video-production** — ComfyUI workspace management and cover-art generation.

## Required external tools

The pipelines assume access to generation platforms via MCP or CLI:

- **Fal** (Flux, Kling, etc.)
- **Replicate**
- **ElevenLabs** (or another voice provider)
- **ffmpeg** (system binary, used for assembly and export)

Configure these per the user's existing setup. The plugin reads model selection from the per-project `brief/tools-and-models.md`.

## Installation

```bash
claude plugins install ai-video-production-lifecycle@danielrosehill
```

## License

MIT
