---
name: text-to-video-direct
description: Single-step text-to-video generation (Sora, Veo, Kling text mode, Hailuo). Use for quick exploratory shots or when motion is more important than precise framing.
---

# Direct Text-to-Video Pipeline

Single model call from a text prompt to a clip. No intermediate still.

## When to use

- Exploratory or B-roll shots where you don't need to lock the opening frame.
- Motion-heavy shots where the model's interpretation of motion matters more than composition.
- Faster iteration when image-then-animate is overkill.

## When NOT to use

- Character-specific shots needing visual consistency — direct text-to-video drifts heavily across takes. Use `text-to-image-to-video` instead.
- Talking heads — use `voice-to-lip-sync` over a generated character clip.

## Inputs

- Shot brief from `scripts/storyboards/NN-*.md`.
- Text-to-video model from `brief/tools-and-models.md`.

## Steps

1. **Compose prompt.** Combine visual seed + motion description + style/vibe. Show to user.
2. **Generate.** Call the configured text-to-video model. Save to `generation/text-to-video/NN-shortname-vN.mp4`. Save prompt + model + parameters to `generation/prompts/NN-shortname-vN.md`. Log it.
3. **Surface.** Show clip. Offer retry, accept, or switch to text-to-image-to-video for tighter control.
4. **Accept.** Copy to `clips/raw/` and suggest `/promote-take`.

## Common gotchas

- **Cost per retry is high.** Text-to-video models are typically the most expensive call in any pipeline. Iterate the prompt carefully before each call — don't just hit retry.
- **Aspect / duration locked at gen time.** Most models don't let you crop or extend after the fact cleanly. Set both correctly per the brief.
