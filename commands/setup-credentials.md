---
description: One-time setup for fal.ai, Replicate, WaveSpeed, and MiniMax credentials, plus runner toolchain bootstrap. Writes ~/.config/ai-video-producer/.env, sources it from the user's shell profile, and installs the npm + pip dependencies needed by the SDK runners under runners/.
---

Set up persistent credentials for the bundled MCP servers (fal.ai, Replicate, MiniMax) and SDK runners (fal-js, WaveSpeed Python), then bootstrap the runner toolchains.

## Steps

1. Check if `~/.config/ai-video-producer/.env` already exists.
   - If yes, read it (do not echo the values back) and report which keys are already set. Ask the user if they want to update any.
   - If no, create the directory: `mkdir -p ~/.config/ai-video-producer`.

2. Prompt the user for each missing value:
   - `FAL_KEY` — fal.ai API key (https://fal.ai/dashboard/keys). Used by the hosted MCP server at `https://mcp.fal.ai/mcp` **and** by `runners/fal_run.mjs`.
   - `REPLICATE_API_TOKEN` — Replicate API token (https://replicate.com/account/api-tokens). Used by the local `replicate-mcp` npm package.
   - `WAVESPEED_API_KEY` — WaveSpeedAI key (https://wavespeed.ai/accesskey). Used by `runners/wavespeed_run.py`.
   - `MINIMAX_API_KEY` — MiniMax key. Used by the bundled `minimax-mcp` server. Region matters: Global keys come from https://www.minimax.io/platform/user-center/basic-information/interface-key, Mainland from https://platform.minimaxi.com/user-center/basic-information/interface-key.
   - `MINIMAX_API_HOST` — `https://api.minimax.io` (Global) or `https://api.minimaxi.com` (Mainland). Must match the key region or the MCP returns "Invalid API key".
   - `MINIMAX_MCP_BASE_PATH` — local output directory MiniMax should write generated media into (default: `$HOME/Videos/minimax`).
   - `MINIMAX_API_RESOURCE_MODE` — `url` (default) or `local`.

   Accept blank to skip a key. Each provider degrades independently (skipping `WAVESPEED_API_KEY` just means the wavespeed runner won't work; skipping `MINIMAX_API_KEY` disables the minimax MCP).

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
   bash -lc 'for k in FAL_KEY REPLICATE_API_TOKEN WAVESPEED_API_KEY MINIMAX_API_KEY MINIMAX_API_HOST; do v="${!k}"; echo "$k: ${v:+set}${v:-MISSING}"; done'
   ```
   Report which are `set` and which are `MISSING`. Do not print the actual key values.

6. **Bootstrap runner toolchains.** The SDK runners under `runners/` need their own deps installed once per machine. Resolve `${CLAUDE_PLUGIN_ROOT}/runners` (or fall back to the repo's `runners/` directory if running from a checkout) and:

   - **fal-js**: `cd runners && npm install` — installs `@fal-ai/client` for `fal_run.mjs`. Skip if `runners/node_modules/@fal-ai/client` already exists.
   - **WaveSpeed Python**: prefer a venv. Check for `runners/.venv`; if absent, create with `python3 -m venv runners/.venv`. Then `runners/.venv/bin/pip install -r runners/requirements.txt`. If the user has a global preference for `pipx`/system pip, ask before creating the venv.

   Skip whichever toolchain corresponds to a key the user left blank.

7. Tell the user how to confirm the runners work:
   ```
   FAL_KEY=$FAL_KEY node runners/fal_run.mjs --help 2>&1 | head -3   # should print usage
   runners/.venv/bin/python runners/wavespeed_run.py --help          # should print usage
   ```

8. Remind the user that:
   - Claude Code reads env vars from the process it inherits — so any new Claude Code session started from a shell that has sourced `.env` will see the keys.
   - To use the keys *right now* in this session, the user can either restart Claude Code from a fresh shell, or export the values manually for the current process.
   - The MiniMax MCP runs via `uvx`; if `uvx` isn't on PATH, install with `curl -LsSf https://astral.sh/uv/install.sh | sh`.

## Discipline

- Never echo or log the secret values themselves.
- Never write keys into the plugin directory or the user's home dotfiles directly — only into `~/.config/ai-video-producer/.env`.
- Don't add the loader line more than once. Grep the profile first.
- Don't `chmod 600` if the file already has tighter permissions.
