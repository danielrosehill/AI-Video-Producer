#!/usr/bin/env node
// Run a fal.ai model via the official @fal-ai/client SDK.
//
// Usage:
//   node fal_run.mjs <model_id> <input.json|->  [--output <dir>] [--no-download]
//
// Examples:
//   node fal_run.mjs fal-ai/flux/dev '{"prompt":"a cat"}'
//   echo '{"prompt":"a cat"}' | node fal_run.mjs fal-ai/flux/dev -
//   node fal_run.mjs fal-ai/flux/dev input.json --output generation/text-to-image/
//
// Reads FAL_KEY from env. Streams queue updates to stderr; writes a JSON result
// envelope to stdout: { request_id, model, output_files: [...], data: <raw> }.

import { fal } from "@fal-ai/client";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join, basename, extname } from "node:path";
import { Buffer } from "node:buffer";

function die(msg, code = 1) {
  console.error(`fal_run: ${msg}`);
  process.exit(code);
}

const args = process.argv.slice(2);
if (args.length < 2) die("usage: fal_run.mjs <model_id> <input.json|-|inline-json> [--output <dir>] [--no-download]");

const modelId = args[0];
const inputArg = args[1];
let outputDir = null;
let download = true;
for (let i = 2; i < args.length; i++) {
  if (args[i] === "--output") outputDir = args[++i];
  else if (args[i] === "--no-download") download = false;
  else die(`unknown flag: ${args[i]}`);
}

if (!process.env.FAL_KEY) die("FAL_KEY not set in environment");

let inputJson;
try {
  let raw;
  if (inputArg === "-") raw = readFileSync(0, "utf8");
  else if (existsSync(inputArg)) raw = readFileSync(inputArg, "utf8");
  else raw = inputArg;
  inputJson = JSON.parse(raw);
} catch (e) {
  die(`could not parse input JSON: ${e.message}`);
}

fal.config({ credentials: process.env.FAL_KEY });

const result = await fal.subscribe(modelId, {
  input: inputJson,
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS" && update.logs) {
      for (const l of update.logs) console.error(`[fal] ${l.message}`);
    } else {
      console.error(`[fal] status=${update.status}`);
    }
  },
});

const outputFiles = [];
if (download && outputDir) {
  mkdirSync(outputDir, { recursive: true });
  // Walk the result for any { url, content_type } file objects and download.
  const queue = [result.data];
  let idx = 0;
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;
    if (typeof node === "object" && typeof node.url === "string") {
      const u = new URL(node.url);
      const ext = extname(u.pathname) || ".bin";
      const name = `${basename(modelId).replace(/[^a-z0-9._-]/gi, "_")}-${result.requestId || Date.now()}-${idx++}${ext}`;
      const dest = resolve(join(outputDir, name));
      const res = await fetch(node.url);
      if (!res.ok) die(`download failed ${res.status} for ${node.url}`);
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      outputFiles.push(dest);
      continue;
    }
    if (Array.isArray(node)) queue.push(...node);
    else if (typeof node === "object") queue.push(...Object.values(node));
  }
}

process.stdout.write(JSON.stringify({
  request_id: result.requestId,
  model: modelId,
  output_files: outputFiles,
  data: result.data,
}, null, 2) + "\n");
