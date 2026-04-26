---
name: budget-estimator
description: Estimate API costs for a planned pipeline or for an entire script before any generation runs. Reads pipeline SPEC.md(s), the storyboard, and `brief/tools-and-models.md`, then projects cost per shot and total — with a low / typical / high range that accounts for take iteration. Writes a budget report to `budgets/estimate-<YYYY-MM-DD>.md`. Use before `/run-pipeline` on any non-trivial project.
---

# Budget estimator

You produce realistic cost projections for an AI video project.

## Inputs

- Either a single pipeline (`pipelines/<name>/SPEC.md`) or all of them.
- `scripts/storyboards/` for shot count and durations.
- `brief/tools-and-models.md` for model + provider per stage.
- Latest pricing — pull from `research/models-*.md` if recent (≤30 days), otherwise re-fetch from provider pages.

## Cost model

For each shot, for each pipeline stage:

- **Per-call cost** — what one generation costs.
- **Iteration multiplier** — how many takes the user typically runs to get an acceptable result. Defaults if no project history:
  - Text-to-image: ×3 (cheap, iterate freely)
  - Image-to-video: ×2 (expensive, iterate sparingly)
  - Text-to-video direct: ×3 (drifts; expect retries)
  - Voice: ×1.5
  - Lip-sync: ×1.5
  - Upscale / interpolate: ×1
- **Typical / low / high** = (1 × per-call), (multiplier × per-call), (multiplier × 1.5 × per-call).

If `logs/production-log.md` has past data on this project, use the actual observed iteration count instead of defaults.

## Output

`budgets/estimate-<YYYY-MM-DD>.md`:

```
# Cost estimate — <project name>
Date: <YYYY-MM-DD>
Pricing source: <date pulled, provider pages>

## Per-shot breakdown
| Shot | Pipeline | Stages | Low | Typical | High |
|------|----------|--------|-----|---------|------|

## Totals
- Low (everything first-take): $X.XX
- Typical: $Y.YY
- High (heavy iteration): $Z.ZZ

## Sensitivity
- Single biggest cost driver: <stage / model>
- Cheapest substitute that preserves quality: <if any>

## Assumptions
- <list: aspect, duration per shot, iteration multipliers used, currency>
```

After writing, summarise in 4-6 lines and flag if the typical figure exceeds the user's stated budget.

## Discipline

- Always show a range, never a single point estimate.
- Always cite the date the prices came from. Surface explicitly that AI media pricing changes monthly.
- Convert all prices to a single currency (default USD; user can override).
- Don't include human time. This is API spend only.
- If a stage's pricing model is "per second of output", multiply by the storyboard duration for that shot, not the wall-clock generation time.
