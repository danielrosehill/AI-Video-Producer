#!/usr/bin/env python3
"""Run a WaveSpeedAI model via the official `wavespeed` Python SDK.

Usage:
    python wavespeed_run.py <model_id> <input.json|-|inline-json> \
        [--output <dir>] [--no-download] [--sync] [--timeout <sec>]

Examples:
    python wavespeed_run.py wavespeed-ai/z-image/turbo '{"prompt":"a cat"}'
    echo '{"prompt":"a cat"}' | python wavespeed_run.py wavespeed-ai/z-image/turbo -
    python wavespeed_run.py wavespeed-ai/z-image/turbo input.json --output generation/text-to-image/

Reads WAVESPEED_API_KEY from env. Writes a JSON envelope to stdout:
    {"model": ..., "output_files": [...], "data": <raw SDK output>}.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlopen

try:
    import wavespeed
except ImportError:
    sys.exit("wavespeed_run: `wavespeed` package not installed. Run: pip install wavespeed")


def die(msg: str, code: int = 1) -> None:
    print(f"wavespeed_run: {msg}", file=sys.stderr)
    sys.exit(code)


def load_input(arg: str) -> dict:
    if arg == "-":
        raw = sys.stdin.read()
    elif Path(arg).is_file():
        raw = Path(arg).read_text()
    else:
        raw = arg
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        die(f"could not parse input JSON: {e}")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("model_id")
    p.add_argument("input")
    p.add_argument("--output")
    p.add_argument("--no-download", action="store_true")
    p.add_argument("--sync", action="store_true")
    p.add_argument("--timeout", type=float, default=36000.0)
    args = p.parse_args()

    if not os.environ.get("WAVESPEED_API_KEY"):
        die("WAVESPEED_API_KEY not set in environment")

    payload = load_input(args.input)

    print(f"[wavespeed] running {args.model_id}", file=sys.stderr)
    t0 = time.time()
    result = wavespeed.run(
        args.model_id,
        payload,
        timeout=args.timeout,
        enable_sync_mode=args.sync,
    )
    print(f"[wavespeed] done in {time.time() - t0:.1f}s", file=sys.stderr)

    output_files: list[str] = []
    outputs = result.get("outputs") if isinstance(result, dict) else None
    if outputs and not args.no_download and args.output:
        out_dir = Path(args.output)
        out_dir.mkdir(parents=True, exist_ok=True)
        slug = re.sub(r"[^a-z0-9._-]+", "_", args.model_id.split("/")[-1], flags=re.I)
        ts = int(time.time())
        for i, url in enumerate(outputs):
            if not isinstance(url, str) or not url.startswith(("http://", "https://")):
                continue
            ext = Path(urlparse(url).path).suffix or ".bin"
            dest = out_dir / f"{slug}-{ts}-{i}{ext}"
            with urlopen(url) as r, open(dest, "wb") as f:
                f.write(r.read())
            output_files.append(str(dest.resolve()))

    json.dump(
        {"model": args.model_id, "output_files": output_files, "data": result},
        sys.stdout,
        indent=2,
        default=str,
    )
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
