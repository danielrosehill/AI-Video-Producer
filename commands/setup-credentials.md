---
description: One-time setup for fal.ai + Replicate credentials. Writes ~/.config/ai-video-producer/.env and ensures it's sourced by future shells so the bundled MCP servers always have keys when the plugin is invoked.
---

Set up persistent credentials for the bundled fal.ai and Replicate MCP servers.

## Steps

1. Check if `~/.config/ai-video-producer/.env` already exists.
   - If yes, read it (do not echo the values back) and report which keys are already set. Ask the user if they want to update any.
   - If no, create the directory: `mkdir -p ~/.config/ai-video-producer`.

2. Prompt the user for each missing value:
   - `FAL_KEY` — fal.ai API key (https://fal.ai/dashboard/keys). Used by the hosted MCP server at `https://mcp.fal.ai/mcp`.
   - `REPLICATE_API_TOKEN` — Replicate API token (https://replicate.com/account/api-tokens). Used by the local `replicate-mcp` npm package.

   Accept blank to skip a key (the corresponding MCP server simply won't be functional).

3. Write `~/.config/ai-video-producer/.env` with `KEY=value` lines. Mode `600`.

4. Ensure the env loader is in the user's shell profile. Detect the shell from `$SHELL` (default `~/.bashrc`; for zsh use `~/.zshrc`). The loader line:

   ```
   # AI Video Producer credentials
   [ -f "$HOME/.config/ai-video-producer/.env" ] && set -a && . "$HOME/.config/ai-video-producer/.env" && set +a
   ```

   - If the line is already present, do nothing.
   - If not, append it. Tell the user to either start a new shell or `source` their profile to pick up the values for the current session.

5. Verify by running (in a subshell that sources the profile):
   ```
   bash -lc 'echo "fal: ${FAL_KEY:+set}${FAL_KEY:-MISSING}"; echo "replicate: ${REPLICATE_API_TOKEN:+set}${REPLICATE_API_TOKEN:-MISSING}"'
   ```
   Report which are `set` and which are `MISSING`. Do not print the actual key values.

6. Remind the user that:
   - Claude Code reads env vars from the process it inherits — so any new Claude Code session started from a shell that has sourced `.env` will see the keys.
   - To use the keys *right now* in this session, the user can either restart Claude Code from a fresh shell, or export the values manually for the current process.

## Discipline

- Never echo or log the secret values themselves.
- Never write keys into the plugin directory or the user's home dotfiles directly — only into `~/.config/ai-video-producer/.env`.
- Don't add the loader line more than once. Grep the profile first.
- Don't `chmod 600` if the file already has tighter permissions.
