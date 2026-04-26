---
description: Break the locked script into a numbered shot list. Writes scripts/storyboards/ and timeline/shot-list.md.
---

Read `scripts/final/script.md` (fall back to the latest in `scripts/drafts/` if not yet promoted — but warn the user).

Produce a shot list. For each shot:

| # | Duration | Visual | Audio | Generation approach | Pipeline |
|---|----------|--------|-------|---------------------|----------|

- **#** — `01`, `02`, ... matches the `NN` in artefact filenames.
- **Visual** — one-sentence description of what's on screen.
- **Audio** — VO line, dialogue, SFX, music cue.
- **Generation approach** — which modality (text-to-image-to-video, text-to-video direct, stock + edit, etc.) and which model from `brief/tools-and-models.md`.
- **Pipeline** — name of the file in `pipelines/` to invoke (or "custom").

Write the table to `timeline/shot-list.md`.

For each shot, also write a per-shot brief at `scripts/storyboards/NN-shortname.md` containing: visual prompt seed, audio script, character refs, duration, and notes. These become the input to `/run-pipeline`.

Confirm shot count and total runtime against the brief. Flag mismatches.
