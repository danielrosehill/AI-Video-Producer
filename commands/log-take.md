---
description: Record a generated artefact's prompt, model, and parameters alongside the file. Usage: /log-take <artefact-path>
argument-hint: <artefact-path>
---

Argument: $ARGUMENTS — path to a generated artefact.

1. Confirm the file exists.
2. Ask the user (or infer from chat context) for: prompt text, model used, platform (Fal/Replicate/etc.), seed, key parameters, approximate cost.
3. Write `generation/prompts/<same-stem>.md` with all of the above plus a timestamp and a link to the artefact.
4. Append a one-line entry to `logs/production-log.md`:
   `YYYY-MM-DD HH:MM | <model> | <platform> | $<cost> | <artefact-path>`
5. Confirm both writes.
