---
description: Capture the creative brief, target spec, and model selection for this video project. Run this first.
---

You are onboarding the user to this AI video production workspace. The goal is to populate `brief/creative-brief.md` and `brief/tools-and-models.md` so subsequent generation work has a clear target.

Walk through these areas conversationally — don't dump the full questionnaire at once. Ask in small batches, infer where you can, and confirm.

## 1. Objective and concept
- One-sentence description of the video
- Intended audience and where it will be published (YouTube short, Instagram reel, internal demo, etc.)
- Tone / vibe (cinematic, surreal, documentary, comedic, etc.) — ask for reference videos or images if helpful

## 2. Target spec
- Approximate runtime (seconds)
- Aspect ratio (16:9, 9:16, 1:1, etc.)
- Resolution and frame rate
- Output format (mp4/h264, mov/prores, etc.)
- Audio: voiceover? music? SFX? subtitles?

## 3. Models and tools
- Which platform(s): Fal, Replicate, ElevenLabs, local ComfyUI, other
- Specific model preferences for each modality:
  - Text-to-image (e.g. Flux, SDXL, Imagen)
  - Image-to-video (e.g. Kling, Runway, Hailuo, Wan)
  - Text-to-video (if used directly)
  - Voice generation / cloning (e.g. ElevenLabs, Chatterbox)
  - Lip-sync (e.g. Sync.so, LatentSync)
  - Upscaling / interpolation
- Any models explicitly to avoid

## 4. Characters / subjects
- Are there recurring characters or subjects? If yes, note them — `/define-character` will be used to flesh each one out.

## 5. Constraints
- Budget cap on generation costs (if any)
- Deadline
- Anything that's a hard no (specific styles, content, brands)

## Outputs

Write two files:

**`brief/creative-brief.md`** — sections: Objective, Audience, Vibe & References, Target Spec, Constraints, Deliverable Checklist.

**`brief/tools-and-models.md`** — table of modality → chosen model → platform → notes. This file is the source of truth Claude consults before invoking any model later.

Confirm both files with the user before exiting. Then suggest the next step:
- If characters were mentioned → `/define-character`
- Otherwise → `/draft-script`
