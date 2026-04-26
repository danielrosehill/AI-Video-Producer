---
description: Promote a raw take into clips/selected/ with rationale. Usage: /promote-take <raw-path>
argument-hint: <raw-path>
---

Argument: $ARGUMENTS — path to a take in `clips/raw/` or `generation/`.

1. Verify the file exists.
2. Ask for a one-line rationale ("why is this the chosen take?").
3. Copy (don't move — keep the raw) to `clips/selected/<same-filename>`.
4. Append to `clips/selected/SELECTIONS.md` a row: shot number, filename, rationale, source path.
5. If a previous take for the same shot number is already in `clips/selected/`, ask whether to replace, keep both, or version-bump.
