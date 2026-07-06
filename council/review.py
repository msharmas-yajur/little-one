#!/usr/bin/env python3
"""
review.py — the Review Council (PRD 0003 / knowledge-base/COUNCIL.md).

A panel of rubric-anchored LLM judges. Six "seats", each bound to specific
knowledge-base pages (its *constitution*), review one artifact IN PARALLEL and
INDEPENDENTLY, each returning a structured verdict that must cite KB principles.
A fixed Chairman then synthesizes the six verdicts into readable prose. The
publish/revise/escalate DECISION is computed deterministically from the verdicts
(COUNCIL.md decision rule) — the LLM never gets to override the gate.

Runs at build/CI time only (never on the child's device). Uses the Anthropic SDK
with structured outputs; model claude-opus-4-8; ANTHROPIC_API_KEY from env.

Usage:
  python council/review.py --story chatter-chatter
  python council/review.py --game who-says
  python council/review.py --file some.md --kind "wiki page"
  python council/review.py --story chatter-chatter --dry-run   # no API calls
"""
from __future__ import annotations
import argparse, asyncio, json, sys, textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-opus-4-8"

# ── The seats. Each is named for a principle and grounded in specific KB pages
#    (its constitution). Order is display order; all run in parallel.
SEATS = [
    {"key": "explorer", "name": "Explorer's Seat", "after": "after Gopnik",
     "lens": "Does this invite open-ended exploration, or is it a carpenter drilling a lesson? Is the child treated as an explorer?",
     "sources": ["knowledge-base/wiki/concepts/gopnik-foundation.md",
                 "knowledge-base/raw/research/books/gardener-and-the-carpenter.md"]},
    {"key": "skills", "name": "Skills Seat", "after": "after Galinsky",
     "lens": "Is every skill tag honest — does the experience actually exercise the life skill it claims?",
     "sources": ["knowledge-base/wiki/concepts/seven-life-skills.md",
                 "knowledge-base/raw/research/books/mind-in-the-making.md"]},
    {"key": "voice", "name": "Voice Seat", "after": "after Kuhl; Byers-Heinlein",
     "lens": "Is the grown-up still the language mechanism (social gating)? Is serve-and-return present where claimed? Are any bilingual claims honest?",
     "sources": ["knowledge-base/wiki/concepts/responsive-talk.md",
                 "knowledge-base/raw/research/bilingual-early-years.md"]},
    {"key": "tone", "name": "Tone Seat", "after": "after Faber & King",
     "lens": "Is talk descriptive, never judging? Are feelings acknowledged first? Does it never scold, never test, never fail the child?",
     "sources": ["knowledge-base/raw/research/books/how-to-talk-little-kids.md",
                 "knowledge-base/wiki/concepts/responsive-talk.md"]},
    {"key": "guardian", "name": "Guardian Seat", "after": "house counsel",
     "lens": "Any PII/names? Any fail state? Does it stay within content+KB bounds and use only existing art keys? Age red-lines respected? You are the strictest seat.",
     "sources": ["knowledge-base/wiki/concepts/privacy-model.md",
                 "knowledge-base/wiki/concepts/design-principles.md",
                 "knowledge-base/CLAUDE.md"]},
    {"key": "lap", "name": "Lap Seat", "after": "house wisdom",
     "lens": "Can a tired grown-up read this aloud at 9pm with a squirming one-year-old on their lap? Rhythm, length, cue practicality — does it serve the dyad, not just the child in the abstract?",
     "sources": ["knowledge-base/wiki/concepts/design-principles.md",
                 "knowledge-base/wiki/concepts/the-12-month-arc.md"]},
]

SEAT_SCHEMA = {
    "type": "object", "additionalProperties": False,
    "required": ["verdict", "cited_principles", "concerns", "suggested_revisions", "rationale"],
    "properties": {
        "verdict": {"type": "string", "enum": ["approve", "revise", "reject"]},
        "cited_principles": {"type": "array", "items": {"type": "string"},
                             "description": "KB pages/principles that pass or fail, cited by path or name."},
        "concerns": {"type": "array", "items": {"type": "string"}},
        "suggested_revisions": {"type": "array", "items": {"type": "string"}},
        "rationale": {"type": "string", "description": "One or two sentences."},
    },
}

CHAIR_SCHEMA = {
    "type": "object", "additionalProperties": False,
    "required": ["synthesis", "key_disagreements"],
    "properties": {
        "synthesis": {"type": "string", "description": "A short readable synthesis of the six verdicts for the owner."},
        "key_disagreements": {"type": "array", "items": {"type": "string"},
                              "description": "Where seats disagreed and why it matters (empty if unanimous)."},
    },
}


def read(path: str) -> str:
    p = ROOT / path
    return p.read_text(encoding="utf-8") if p.exists() else f"[missing: {path}]"


def load_charter() -> str:
    return read("knowledge-base/COUNCIL.md")


def load_artifact(args) -> tuple[str, str]:
    """Return (kind, text) for the artifact under review."""
    import yaml
    if args.story or args.game:
        which = "_data/stories.yml" if args.story else "_data/wordgames.yml"
        target = args.story or args.game
        items = yaml.safe_load(read(which)) or []
        found = next((it for it in items if isinstance(it, dict) and it.get("id") == target), None)
        if not found:
            sys.exit(f"error: id '{target}' not found in {which}")
        kind = "story" if args.story else "word-game"
        return kind, yaml.safe_dump(found, allow_unicode=True, sort_keys=False)
    if args.file:
        return (args.kind or "artifact"), read(args.file)
    if args.text:
        return (args.kind or "artifact"), args.text
    sys.exit("error: provide one of --story / --game / --file / --text")


def seat_system(seat: dict, charter: str) -> str:
    constitution = "\n\n".join(f"### SOURCE: {s}\n{read(s)}" for s in seat["sources"])
    return textwrap.dedent(f"""\
        You are the **{seat['name']}** ({seat['after']}) on the Review Council for the
        "Little One" children's storybook project. You are a rubric-anchored judge,
        NOT a persona: you do not impersonate or invent positions for any researcher.
        You are adversarial by design — your job is to find reasons to reject; approval
        is the ABSENCE of found objections, never enthusiasm.

        YOUR LENS — the single question you evaluate: {seat['lens']}

        Every verdict MUST cite the specific principle (by KB path or name) that passes
        or fails. A verdict without a citation is invalid. If your constitution does not
        cover a point, say so and do not improvise developmental science.

        ── THE COUNCIL CHARTER (binds you) ──
        {charter}

        ── YOUR CONSTITUTION (the rubric you judge against) ──
        {constitution}
        """)


def chair_system(charter: str) -> str:
    return textwrap.dedent(f"""\
        You are the **Chairman** of the Review Council for the "Little One" project.
        You do NOT re-review the artifact yourself. You weigh the six seats' verdicts,
        name the real disagreements honestly, and write one short synthesis for the
        owner. Be plain and readable; a stable voice keeps the ledger legible. The
        publish/revise/escalate decision is computed mechanically from the verdicts and
        is given to you — do not contradict it; explain it.

        ── THE COUNCIL CHARTER ──
        {charter}
        """)


def decision_from(verdicts: dict) -> tuple[str, str]:
    """COUNCIL.md decision rule, computed deterministically."""
    if any(v.get("_error") for v in verdicts.values()):
        return "escalate", "A seat failed to return a valid verdict — escalating to the owner."
    vals = {k: v["verdict"] for k, v in verdicts.items()}
    if vals.get("guardian") != "approve":
        return "escalate", "The Guardian Seat did not approve — escalates to the owner (the Guardian's hold cannot be overridden)."
    if any(v == "reject" for v in vals.values()):
        rejects = [k for k, v in vals.items() if v == "reject"]
        return "escalate", f"Reject verdict(s) from: {', '.join(rejects)} — escalates to the owner."
    if any(v == "revise" for v in vals.values()):
        revs = [k for k, v in vals.items() if v == "revise"]
        return "revise", f"Revise verdict(s) from: {', '.join(revs)} — one bounce back to the generator, then the owner."
    return "publish", "Unanimous approve — clears the council gate (instance classes publish; class changes still go to the owner)."


async def run_seat(client, seat, charter, kind, artifact):
    user = (f"Review this {kind} for the Little One project against your lens and "
            f"constitution. Return your structured verdict.\n\n=== ARTIFACT ({kind}) ===\n{artifact}")
    try:
        resp = await client.messages.create(
            model=MODEL, max_tokens=10000,
            thinking={"type": "adaptive"},
            output_config={"effort": "medium",
                           "format": {"type": "json_schema", "schema": SEAT_SCHEMA}},
            system=seat_system(seat, charter),
            messages=[{"role": "user", "content": user}],
        )
        if resp.stop_reason == "refusal":
            return seat["key"], {"_error": "refusal", "verdict": "reject", "cited_principles": [],
                                 "concerns": ["The model declined to review this artifact."],
                                 "suggested_revisions": [], "rationale": "refusal"}
        text = next((b.text for b in resp.content if b.type == "text"), "")
        data = json.loads(text)
        return seat["key"], data
    except Exception as e:  # noqa: BLE001 — surface any seat failure as an escalation, never a silent pass
        return seat["key"], {"_error": str(e), "verdict": "reject", "cited_principles": [],
                             "concerns": [f"Seat error: {e}"], "suggested_revisions": [], "rationale": "error"}


async def run_chair(client, charter, kind, verdicts, decision, decision_reason):
    summary = {k: {kk: vv for kk, vv in v.items() if kk != "_error"} for k, v in verdicts.items()}
    user = (f"The six seats have returned their verdicts on a {kind}. The mechanical decision is "
            f"**{decision}** ({decision_reason}). Synthesize the verdicts for the owner and name any "
            f"real disagreements.\n\n=== SEAT VERDICTS (JSON) ===\n{json.dumps(summary, indent=2)}")
    resp = await client.messages.create(
        model=MODEL, max_tokens=8000,
        thinking={"type": "adaptive"},
        output_config={"effort": "high", "format": {"type": "json_schema", "schema": CHAIR_SCHEMA}},
        system=chair_system(charter),
        messages=[{"role": "user", "content": user}],
    )
    text = next((b.text for b in resp.content if b.type == "text"), "{}")
    return json.loads(text)


def render(kind, target, verdicts, decision, decision_reason, chair) -> str:
    icon = {"publish": "🟢", "revise": "🟡", "escalate": "🔴"}[decision]
    out = [f"# 🏛️ Review Council — {kind}: `{target}`", "",
           f"## {icon} Decision: **{decision.upper()}**", f"_{decision_reason}_", ""]
    if chair:
        out += ["## Chairman's synthesis", chair.get("synthesis", "").strip(), ""]
        dis = chair.get("key_disagreements") or []
        if dis:
            out += ["**Key disagreements:**"] + [f"- {d}" for d in dis] + [""]
    out += ["## Seat verdicts", ""]
    vmark = {"approve": "✅ approve", "revise": "🟡 revise", "reject": "❌ reject"}
    for seat in SEATS:
        v = verdicts[seat["key"]]
        out.append(f"### {seat['name']} — {vmark.get(v.get('verdict'), v.get('verdict'))}")
        if v.get("_error"):
            out.append(f"> ⚠️ seat error: {v['_error']}")
        if v.get("rationale"):
            out.append(v["rationale"])
        if v.get("cited_principles"):
            out.append("**Cited:** " + "; ".join(v["cited_principles"]))
        for c in v.get("concerns", []):
            out.append(f"- ⚠️ {c}")
        for r in v.get("suggested_revisions", []):
            out.append(f"- ✏️ {r}")
        out.append("")
    return "\n".join(out)


async def amain(args):
    charter = load_charter()
    kind, artifact = load_artifact(args)
    target = args.story or args.game or args.file or "inline"

    if args.dry_run:
        print(f"[dry-run] kind={kind} target={target}")
        print(f"[dry-run] charter chars: {len(charter)}")
        for seat in SEATS:
            sysp = seat_system(seat, charter)
            print(f"[dry-run] seat {seat['key']:9s} system prompt chars: {len(sysp)}  sources: {seat['sources']}")
        print(f"[dry-run] artifact ({kind}) chars: {len(artifact)}")
        print("[dry-run] would run 6 seats in parallel + 1 chairman; no API calls made.")
        return 0

    import anthropic
    client = anthropic.AsyncAnthropic()
    results = await asyncio.gather(*[run_seat(client, s, charter, kind, artifact) for s in SEATS])
    verdicts = dict(results)
    decision, reason = decision_from(verdicts)
    chair = await run_chair(client, charter, kind, verdicts, decision, reason)
    report = render(kind, target, verdicts, decision, reason, chair)

    print(report)
    if args.out:
        Path(args.out).write_text(report, encoding="utf-8")
    # exit code encodes the gate for CI: 0 publish, 20 revise, 30 escalate
    return {"publish": 0, "revise": 20, "escalate": 30}[decision]


def main():
    ap = argparse.ArgumentParser(description="Run the Review Council on one artifact.")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--story", help="review a story by id from _data/stories.yml")
    g.add_argument("--game", help="review a word-game by id from _data/wordgames.yml")
    g.add_argument("--file", help="review an arbitrary file")
    g.add_argument("--text", help="review inline text")
    ap.add_argument("--kind", help="label for --file/--text (e.g. 'wiki page')")
    ap.add_argument("--out", help="also write the report to this path")
    ap.add_argument("--dry-run", action="store_true", help="assemble prompts, make no API calls")
    args = ap.parse_args()
    sys.exit(asyncio.run(amain(args)))


if __name__ == "__main__":
    main()
