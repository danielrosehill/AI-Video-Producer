---
name: comfyui-export
description: Export an AI-Video-Producer pipeline to ComfyUI workflow JSON — produce a workflow the user can load in ComfyUI to reproduce (or approximate) a hosted-API pipeline locally. Best-effort: maps fal/replicate model calls to equivalent ComfyUI checkpoints/LoRAs/samplers and flags stages that have no native ComfyUI equivalent. Use when the user wants to take a pipeline that's been working via APIs and bring it onto local hardware (cost reduction, offline work, fine-grained control).
---

# Pipeline → ComfyUI export

## Inputs

- A pipeline directory `pipelines/<name>/` with a complete `SPEC.md` and stage files.
- Target ComfyUI version assumption (default: current — flag if user hasn't updated recently).
- Optional: a checkpoint catalogue (`pipelines/_shared/checkpoints.md` or similar) so you can pick from models the user already has locally.

## Mapping

| Pipeline stage | ComfyUI nodes |
|----------------|---------------|
| Text-to-image (Flux) | `UNETLoader (flux)`, `DualCLIPLoader`, `CLIPTextEncode` ×2, `KSampler`, `VAEDecode`, `SaveImage` |
| Text-to-image (SDXL) | `CheckpointLoaderSimple`, `CLIPTextEncode` ×2, `KSampler`, `VAEDecode`, `SaveImage` |
| Image-to-video (SVD) | `ImageOnlyCheckpointLoader`, `SVD_img2vid_Conditioning`, `KSampler`, `VAEDecode`, `VHS_VideoCombine` |
| Image-to-video (Wan / Hunyuan) | corresponding loader + sampler + VHS combine |
| Upscale (Real-ESRGAN, 4x-UltraSharp) | `UpscaleModelLoader`, `ImageUpscaleWithModel` |
| Frame interpolation (RIFE / FILM) | `RIFE VFI` from `ComfyUI-Frame-Interpolation` |
| ControlNet | `ControlNetLoader`, `ControlNetApply` |
| LoRA | `LoraLoader` chained before sampler |

For stages that have **no native equivalent** (most lip-sync APIs, Runway Gen-3, Kling, Hailuo, Sora, Veo, ElevenLabs) — emit a placeholder Note node with the original API call documented, and tell the user this stage will still need to run via API even after the local move.

## Steps

1. Read `SPEC.md` and each `stages/NN-*.md`.
2. For each stage, look up the mapping. Use the local checkpoint catalogue if provided to pin specific filenames; otherwise emit `<choose checkpoint>` placeholders the user must fill.
3. Build the workflow as **API-format** JSON (flat `{node_id: {class_type, inputs}}`). Sequential numeric IDs starting from `1`. Wire `inputs` references as `[source_id, output_index]` pairs.
4. Set sampler params from the stage definitions (steps, cfg, sampler_name, scheduler, seed). Default seed: `-1` (random) unless the stage specifies a fixed seed.
5. Write outputs:
   - `pipelines/<name>/comfy/workflow-export.json` — the API-format workflow.
   - `pipelines/<name>/comfy/manifest-export.md` — checkpoints, LoRAs, custom nodes the user needs (with `ComfyUI-Manager` install names where possible).
   - Update `SPEC.md` with a "Local execution" section pointing at the export.

## Discipline

- Be honest about gaps. If three of five stages map cleanly and two are API-only, say so on the first line of `manifest-export.md`. Don't pretend a full local equivalent exists.
- Don't invent ComfyUI nodes that don't exist. Verify class names against ComfyUI core + the relevant custom-node packs.
- Where a hosted model's quality is hard to match locally (Sora, Veo, Kling), explicitly say "no comparable local model — closest approximation is X but quality drop is significant".
- Keep the workflow JSON minimal — only the nodes that are part of the pipeline. No stray reroute nodes or notes (other than the gap-flag note for API-only stages).
