# Runners

Thin SDK wrappers that pipeline skills shell out to. Each runner takes a model id and a JSON input blob, calls the provider SDK, downloads any returned files, and prints a single JSON envelope to stdout:

```
{ "model": "...", "output_files": [absolute paths], "data": <raw provider output> }
```

Status / progress logs go to **stderr** so stdout stays parseable.

## Providers

| Provider  | Runner               | Auth env var          | Bootstrap                          |
|-----------|----------------------|------------------------|-------------------------------------|
| fal.ai    | `fal_run.mjs`        | `FAL_KEY`              | `npm install` (in this directory)   |
| WaveSpeed | `wavespeed_run.py`   | `WAVESPEED_API_KEY`    | `pip install -r requirements.txt`   |

Replicate uses its MCP server (`replicate-mcp`) — no runner needed.
MiniMax uses its MCP server (`minimax-mcp` via `uvx`) — no runner needed.

## Bootstrap

`/setup-credentials` will install both runner toolchains. To do it manually:

```bash
cd runners
npm install
pip install -r requirements.txt
```

Python: a venv is recommended (`python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`).

## Invocation contract

```
node runners/fal_run.mjs       <model_id> <input.json|-|inline-json> [--output <dir>] [--no-download]
python runners/wavespeed_run.py <model_id> <input.json|-|inline-json> [--output <dir>] [--no-download] [--sync]
```

- `<input>` is one of: a path to a JSON file, `-` for stdin, or an inline JSON string.
- `--output <dir>` downloads any returned media URLs into that directory and lists them in `output_files`.
- Without `--output`, only the URLs in `data` are returned (no download).

## When to call which

- **Catalog browsing / metadata** → MCP servers (`fal-ai`, `replicate`, `minimax-mcp`).
- **Actual generation, queued jobs, file uploads** → these runners.

The hosted fal MCP at `mcp.fal.ai` is fine for "what models exist", but the SDK runner is what you want for production calls (queue polling, file inputs/outputs, structured errors).
