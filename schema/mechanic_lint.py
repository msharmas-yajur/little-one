#!/usr/bin/env python3
"""
mechanic_lint.py — the capability bound for GENERATED ENGINE CODE (PRD 0003
milestone 4 / knowledge-base/MECHANIC.md).

The experience schema (additionalProperties:false) bounds generated *content*.
But a mechanic PR also adds real JavaScript (a renderer in player.js) + maybe
Liquid (child.html), which the schema can't bound. This is that bound: it scans
the ADDED lines a mechanic introduces to those files for forbidden capabilities —
network, storage, code-eval, external URLs — and enforces additive-and-small.

A mechanic must only compose existing engine primitives; it must never add I/O.
This preserves the spine: no runtime LLM on the child's device, nothing leaves
the device. A red run here fails the gate and no PR opens.

Usage (defaults to the working tree vs HEAD, which is what the in-workflow gate
sees before commit; pass --against <ref> for a committed branch):
  python schema/mechanic_lint.py
  python schema/mechanic_lint.py --against origin/main
"""
from __future__ import annotations
import argparse, re, subprocess, sys

# Files a mechanic may touch that contain executable/served code.
GUARDED = ["assets/js/player.js", "_layouts/child.html"]

# Forbidden capabilities in ADDED lines. No network, no storage, no code-eval,
# no external URLs, no script injection. (DOM primitives like createElement /
# innerHTML / setTimeout / onclick are allowed — they're the engine's own tools.)
FORBIDDEN = [
    (r"\bfetch\s*\(", "network: fetch()"),
    (r"\bXMLHttpRequest\b", "network: XMLHttpRequest"),
    (r"\bWebSocket\b", "network: WebSocket"),
    (r"\bEventSource\b", "network: EventSource"),
    (r"\bnavigator\s*\.\s*sendBeacon\b", "network: sendBeacon"),
    (r"\bimport\s*\(", "code-load: dynamic import()"),
    (r"\bimportScripts\s*\(", "code-load: importScripts"),
    (r"\beval\s*\(", "code-eval: eval()"),
    (r"\bnew\s+Function\b", "code-eval: new Function"),
    (r"\blocalStorage\b", "storage: localStorage"),
    (r"\bsessionStorage\b", "storage: sessionStorage"),
    (r"\bindexedDB\b", "storage: indexedDB"),
    (r"\bdocument\s*\.\s*cookie\b", "storage: document.cookie"),
    (r"\bnavigator\s*\.\s*geolocation\b", "sensor: geolocation"),
    (r"\bnew\s+Worker\s*\(", "worker: new Worker"),
    (r"https?://", "external URL"),
    (r"<\s*script", "script injection"),
    (r"javascript:", "javascript: URL"),
]

# Additive-and-small: a mechanic adds a registry entry + minimal wiring, not a
# rewrite. Caps are generous but block a runaway rewrite of the engine.
MAX_ADDED_PLAYER = 160     # added lines to player.js
MAX_REMOVED_PLAYER = 20    # removed lines from player.js (small wiring edits only)


def diff_lines(path: str, against: str):
    try:
        out = subprocess.run(
            ["git", "diff", "--unified=0", against, "--", path],
            capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError as e:
        return [], [], f"git diff failed for {path}: {e.stderr.strip()}"
    added, removed = [], []
    for ln in out.splitlines():
        if ln.startswith("+") and not ln.startswith("+++"):
            added.append(ln[1:])
        elif ln.startswith("-") and not ln.startswith("---"):
            removed.append(ln[1:])
    return added, removed, None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--against", default="HEAD", help="git ref to diff against (default HEAD = working tree)")
    args = ap.parse_args()

    errors = []
    touched_any = False
    for path in GUARDED:
        added, removed, err = diff_lines(path, args.against)
        if err:
            errors.append(err); continue
        if not added and not removed:
            continue
        touched_any = True
        for line in added:
            for pat, label in FORBIDDEN:
                if re.search(pat, line, re.IGNORECASE):
                    errors.append(f"{path}: forbidden capability [{label}] in added line: {line.strip()[:100]}")
        if path == "assets/js/player.js":
            if len(added) > MAX_ADDED_PLAYER:
                errors.append(f"{path}: +{len(added)} added lines exceeds cap {MAX_ADDED_PLAYER} (a mechanic is a registry entry, not a rewrite)")
            if len(removed) > MAX_REMOVED_PLAYER:
                errors.append(f"{path}: -{len(removed)} removed lines exceeds cap {MAX_REMOVED_PLAYER} (must be additive — don't rewrite existing renderers)")

    if errors:
        print(f"mechanic-lint: {len(errors)} problem(s) — the capability bound blocks this PR:\n", file=sys.stderr)
        for e in errors:
            print(f"  ✗ {e}", file=sys.stderr)
        print("\nA mechanic may only compose existing engine primitives; no network, storage, "
              "code-eval, or external URLs. See knowledge-base/MECHANIC.md.", file=sys.stderr)
        return 1

    if not touched_any:
        print("mechanic-lint: no changes to guarded code files (player.js / child.html).")
    else:
        print("mechanic-lint: OK — engine/layout changes use only existing primitives, additive and small.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
