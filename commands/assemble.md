---
description: Propose an ffmpeg/edit plan to concatenate clips/edited/ into a rough cut in output/drafts/.
---

1. Read `timeline/shot-list.md` for shot order, durations, and audio cues.
2. List what's present in `clips/edited/` (or `clips/selected/` if no edited versions exist).
3. Cross-reference: any shots in the shot list missing from `clips/`? Flag them.
4. Read `brief/creative-brief.md` for target spec (resolution, fps, aspect, format).
5. Draft an ffmpeg command (or sequence) that:
   - Concatenates clips in shot order
   - Overlays VO from `generation/voice/` aligned to shot timing
   - Mixes in music from `assets/music/` and SFX from `assets/sfx/`
   - Conforms to the target spec
6. Show the command to the user. On approval, execute and write to `output/drafts/cut-NN.mp4` (increment NN).
7. Append the assembly recipe to `logs/production-log.md`.

Don't touch `output/final/` from this command — that's `/export-final`.
