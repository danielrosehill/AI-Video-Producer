---
description: Execute a predefined pipeline from pipelines/ for a given shot. Usage: /run-pipeline <pipeline-name> <shot-number>
argument-hint: <pipeline-name> <shot-number>
---

Arguments: $ARGUMENTS

Parse the pipeline name and shot number. Then:

1. Read `pipelines/<pipeline-name>.md` — this defines the chain of model calls and intermediate outputs.
2. Read `scripts/storyboards/<shot-number>-*.md` — the per-shot brief.
3. Read `brief/tools-and-models.md` to confirm model selections.
4. For each step in the pipeline:
   - State what you're about to do and the expected output path.
   - Execute the model call (via the appropriate MCP/CLI/API the user has set up).
   - Save the artefact to `generation/<modality>/NN-shortname-vN.ext`.
   - Save the prompt + model + parameters to `generation/prompts/NN-shortname-vN.md`.
   - Append a line to `logs/production-log.md`.
   - Pause and surface the intermediate output. Ask whether to proceed, retry with adjustments, or abort.
5. After the final step, copy the result into `clips/raw/` and remind the user to `/promote-take` if it's a keeper.

If the pipeline file doesn't exist, list available pipelines and offer to create a new one.

If the shot brief is missing, tell the user to run `/storyboard` first.
