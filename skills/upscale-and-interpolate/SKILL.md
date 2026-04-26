---
name: upscale-and-interpolate
description: Post-processing chain — upscale a clip's resolution and/or interpolate frames for smoother motion. Run after a clip is selected but before final assembly.
---

# Upscale & Interpolate Pipeline

Post-processing for clips that need higher resolution or frame rate than the generation model produced.

## When to use

- Generation model output is 720p/1080p but the brief calls for 4K.
- Clip is 24fps but the brief calls for 60fps slow-mo or smoother motion.
- A specific take is great but visibly soft/low-fps.

## When NOT to use

- Clip is already at target spec — don't upscale unnecessarily, it adds cost and processing time without benefit.
- Source quality is poor — upscaling amplifies artefacts. Regenerate instead.

## Inputs

- A clip in `clips/selected/` (or `clips/raw/` if user wants to upscale before selection).
- Target resolution and fps from `brief/creative-brief.md`.
- Upscale + interpolation models from `brief/tools-and-models.md` (e.g. Topaz, Real-ESRGAN, RIFE, FILM).

## Steps

1. **Confirm target.** Read brief; state current vs target resolution and fps.
2. **Upscale.** Call configured upscaler. Save to `generation/upscale/NN-shortname-vN-up.mp4`. Log it.
3. **Interpolate** (if fps target > source fps). Call interpolation model on the upscaled output. Save to `generation/upscale/NN-shortname-vN-up-interp.mp4`. Log it.
4. **QC.** Show before/after comparison if possible. Watch for: temporal artefacts, ghosting on fast motion, oversharpening haloes.
5. **Promote.** Copy approved final to `clips/edited/NN-shortname-final.mp4`.

## Common gotchas

- **Order matters.** Upscale first, interpolate second. Interpolating then upscaling wastes compute on synthetic frames.
- **Interpolation breaks on cuts.** If a clip contains an internal cut (rare for AI-gen but possible), interpolation will smear across it.
- **File size explosion.** A 4K/60fps clip is ~4× the size of 1080p/30fps. Plan storage accordingly.
