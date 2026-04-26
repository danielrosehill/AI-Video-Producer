---
name: comfyui-import
description: Import a ComfyUI workflow JSON (the API-format export from ComfyUI's "Save (API Format)" option, or the UI-format graph JSON) and turn it into an AI-Video-Producer pipeline SPEC plus stage runners. Maps Comfy nodes to pipeline stages, surfaces the model checkpoints and LoRAs needed, and flags nodes that have no clean equivalent in a hosted-API pipeline. Use when the user has a ComfyUI workflow that works locally and wants to either run it inside a project workspace or document it as a versioned pipeline.
---

# ComfyUI workflow → pipeline import

## Inputs

- A ComfyUI workflow JSON. Two common shapes:
  - **API format** (preferred) — flat `{node_id: {class_type, inputs, ...}}`. Cleaner to parse.
  - **UI format** — `{nodes: [...], links: [...]}`. Has more layout detail; less direct to map.
- A target pipeline name (kebab-case).

## Steps

1. Detect format. If UI format and no `_meta` per-node info, ask the user to re-export with "Save (API Format)" — it's substantially easier to map.
2. Walk nodes in topological order (from `LoadCheckpoint`/`CLIPTextEncode` sinks toward `SaveImage`/`VHS_VideoCombine` sources).
3. Group nodes into pipeline stages by class:
   - Loaders (`CheckpointLoaderSimple`, `LoraLoader`, `VAELoader`) → "model setup"
   - Conditioning (`CLIPTextEncode`, ControlNet) → stage inputs
   - Samplers (`KSampler`, `KSamplerAdvanced`) → generation stage
   - Upscalers / interpolators → post-processing stage
   - Encoders (`SaveImage`, `VHS_VideoCombine`) → output stage
4. Extract:
   - Checkpoints + LoRAs + VAEs needed (filename + ideally a download URL).
   - Sampler params (steps, cfg, sampler_name, scheduler, denoise, seed handling).
   - Prompts (positive / negative).
   - Resolution and frame count for video workflows.
5. Write `pipelines/<name>/SPEC.md` matching the format pipeline-scaffolder produces, plus:
   - `pipelines/<name>/comfy/workflow.json` — the original, unchanged.
   - `pipelines/<name>/comfy/manifest.md` — required checkpoints, LoRAs, VAEs, custom nodes (with repo URLs).
   - One `stages/NN-*.md` per identified stage.
6. Flag nodes that don't translate cleanly to a hosted-API pipeline (custom nodes, IPAdapter setups, advanced controlnet stacks). For each, note: keep ComfyUI-only, or find a fal/replicate equivalent.

## Output checklist

- SPEC.md with stages.
- workflow.json preserved for round-tripping.
- manifest.md listing models + custom-node repos.
- A clear "Hosted-API equivalence" section in SPEC.md showing which stages map to fal/replicate models and which need ComfyUI execution.

## Discipline

- Don't lossily rewrite the workflow. Keep `workflow.json` as ground truth; document is derived.
- Custom nodes are common — list them (`ComfyUI-Manager`-installable name + GitHub URL) so the workflow can be reproduced.
- Don't guess at missing seed/scheduler values — preserve whatever the JSON had.
- If the workflow is video (AnimateDiff, SVD, Hunyuan, Wan, etc.), capture frame_rate, total_frames, motion_module / lora separately.
