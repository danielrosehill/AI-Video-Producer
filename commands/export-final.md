---
description: Finalise the locked draft — encode to spec, embed subtitles, write to output/final/.
---

1. Confirm with the user which draft in `output/drafts/` is the locked cut.
2. Read `brief/creative-brief.md` for final delivery spec (codec, bitrate, resolution, container).
3. Check `exports/subtitles/` for an .srt or .vtt to embed (ask if missing — or offer to skip).
4. Check `exports/thumbnails/` for a poster frame.
5. Encode with ffmpeg to spec, embed subtitles (soft or burned per the brief), and write to `output/final/<project-name>-final.<ext>`.
6. Generate a sidecar `output/final/<project-name>-final.md` with: spec summary, runtime, file size, source draft, models used (rolled up from `logs/production-log.md`), total estimated cost.
7. Append a "FINAL EXPORT" entry to `logs/production-log.md`.
8. Remind the user to commit and push.
