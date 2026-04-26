---
name: text-to-image-to-video
description: Two-stage pipeline that generates a still image from a text prompt (Flux/SDXL/Imagen) then animates it into a video clip (Kling/Runway/Hailuo/Wan). Use when the user wants tight visual control over the opening frame before motion.
---

# Text → Image → Video Pipeline

Two-stage chain. Stage 1 produces a still you can iterate on cheaply; stage 2 animates the chosen still.

## When to use

- The shot needs a specific composition or character pose locked before motion.
- Direct text-to-video drifts off-prompt; this gives you an anchor frame.
- Cost: one image gen + one video gen per accepted take. Iterating on the still is cheap; iterating on motion is not — get the still right first.

## Inputs

- A shot brief from `scripts/storyboards/NN-*.md` (visual prompt seed, duration, character refs).
- Model selection from `brief/tools-and-models.md` (text-to-image model + image-to-video model).
- Optional: character reference image from `characters/<name>.md`.

## Steps

1. **Compose image prompt.** Combine the shot's visual seed + character seed prompt + style/vibe from `brief/creative-brief.md`. Show it to the user before generating.
2. **Generate still.** Call the configured text-to-image model (typically via Fal or Replicate MCP). Save to `generation/text-to-image/NN-shortname-vN.png`. Save prompt + model + seed to `generation/prompts/NN-shortname-vN.md`. Append to `logs/production-log.md`.
3. **Iterate on still.** Show the image. If the user wants to refine, loop on step 2 with an incremented `vN`. Don't proceed until the user approves a still.
4. **Compose motion prompt.** Describe the motion — camera move, subject action, duration. Pull duration from the shot brief.
5. **Animate.** Call the configured image-to-video model with the approved still as input. Save to `generation/image-to-video/NN-shortname-vN.mp4`. Save the motion prompt and parameters to `generation/prompts/NN-shortname-vN-motion.md`. Log it.
6. **Surface result.** Show the clip. Offer: accept (copy to `clips/raw/` and suggest `/promote-take`), retry motion, or go back to step 2 (new still).

## Common gotchas

- **Aspect ratio mismatch.** The still must match the target video aspect from `brief/creative-brief.md`. Set it explicitly in the image gen call; don't rely on the model's default.
- **Character drift across shots.** Always pass the character's seed prompt verbatim. Consider using a character reference image as a control input if the model supports it.
- **Motion model resolution caps.** Some image-to-video models downscale. If final output needs 4K, pair with the upscale-and-interpolate skill.
