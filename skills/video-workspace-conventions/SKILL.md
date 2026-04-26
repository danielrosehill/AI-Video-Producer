---
name: video-workspace-conventions
description: Reference for the AI video production workspace — lifecycle phases, folder layout, naming conventions, and working principles. Loaded by the install-video-workspace command and consulted by other commands when they need to know where things live.
---

# AI Video Production Workspace Conventions

A workspace produced by `/install-video-workspace` follows the conventions below. All other commands in this plugin assume this structure.

## Lifecycle and where things live

| Phase | Folder | Contents |
|-------|--------|----------|
| Brief | `brief/` | Creative brief, target spec, model/tool selection, vibe references |
| Characters | `characters/` | One markdown file per recurring character/subject — appearance, voice, reference image links |
| Script | `scripts/` | `drafts/` (working), `final/` (locked), `storyboards/` (shot-by-shot breakdowns) |
| Source assets | `assets/` | Reference images, voice samples, voice-clone source audio, SFX, music, fonts, LUTs, overlays |
| Generation output | `generation/` | Raw model output by modality: `text-to-image/`, `image-to-image/`, `image-to-video/`, `text-to-video/`, `voice/`, `lip-sync/`, `upscale/`. Prompts that produced each artefact go in `generation/prompts/` |
| Pipelines | `pipelines/` | Per-project copies of pipeline recipes; editable without touching the plugin |
| Clips | `clips/` | `raw/`, `selected/`, `edited/`, `b-roll/` |
| Timeline | `timeline/` | Shot list, edit decision list, sequencing notes |
| Exports | `exports/` | Thumbnails, captions, subtitle files (.srt/.vtt) |
| Output | `output/` | `drafts/` (rough cuts), `proofs/` (review copies), `final/` (locked deliverable) |
| Logs | `logs/` | Per-session production logs, model-call records, cost tracking |

## Working principles

- **Brief before generation.** Don't fire model calls until `brief/creative-brief.md` exists with target runtime, format, aspect ratio, and model selection. If generation starts without a brief, prompt the user to run `/onboard`.
- **Pair every artefact with its prompt.** Whenever a generated image/clip/voice take is saved, also save the prompt + model + seed in `generation/prompts/` with a matching filename stem so a take can be reproduced or iterated.
- **Raw vs selected.** Everything the model produces lands in `generation/<modality>/` and `clips/raw/`. Only takes the user explicitly approves get copied into `clips/selected/`. Never delete raw output without asking — iteration loops back to it.
- **Pipelines are recipes, not magic.** A pipeline file describes a chain (e.g. Flux text-to-image → Kling image-to-video → ElevenLabs voice → lip-sync). When a pipeline is invoked, walk through it step-by-step, surfacing the intermediate outputs for approval.
- **Tools are user-chosen.** Model selection is per-project. Read `brief/tools-and-models.md` for the active selection — don't assume defaults.
- **Log model calls.** Append a one-line entry to `logs/production-log.md` for each non-trivial generation: timestamp, model, cost estimate, output path.

## Naming conventions

- Generated artefacts: `NN-shortname-vN.ext` — e.g. `03-rooftop-establish-v2.mp4`. The `NN` orders shots, `vN` tracks iterations.
- Prompts: matching stem in `generation/prompts/` — e.g. `03-rooftop-establish-v2.md` containing prompt + model + parameters.
- Characters: `characters/<name>.md`.
- Pipelines: `pipelines/<descriptive-name>.md`.

## Slash commands (typical order)

1. `/install-video-workspace` — scaffold this structure into a new directory.
2. `/onboard` — capture the creative brief and tools-and-models selection.
3. `/define-character` — add recurring characters/subjects.
4. `/draft-script` — produce a script draft from the brief.
5. `/storyboard` — break the locked script into a shot list.
6. `/run-pipeline <name> <shot#>` — execute a pipeline for a shot.
7. `/log-take` — record a generated artefact.
8. `/promote-take` — promote a raw take into `clips/selected/`.
9. `/assemble` — propose an ffmpeg edit plan into `output/drafts/`.
10. `/export-final` — encode locked draft to spec, write to `output/final/`.

## What NOT to do

- Don't generate cover art, script, or clips before the brief exists.
- Don't overwrite files in `clips/selected/` or `output/final/` — version with `-v2` suffix instead.
- Don't invoke a model the user hasn't listed in `brief/tools-and-models.md` without asking.
- Don't delete from `generation/` or `clips/raw/` — discarded takes often get revisited.
