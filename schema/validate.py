#!/usr/bin/env python3
"""
validate.py — the experience-schema gate (PRD 0003 milestone 3).

Validates the content library (_data/stories.yml, _data/wordgames.yml) against
schema/experience.schema.json — the capability-bounded declarative contract the
fixed engine renders. This is the Guardian Seat's mechanical arm: it structurally
guarantees generated content can only express experience TYPES the schema
defines (a new type is a human-gated class change), and that a page/game/item
carries no field outside the closed vocabulary (no onclick/url/script/fetch —
additionalProperties:false makes them unrepresentable).

Complementary to .github/gardener/lint.rb (which enforces art-key existence and
content safety). Exit 0 = conforms, 1 = violations. Run:
  python schema/validate.py
"""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    try:
        import yaml
        from jsonschema import Draft202012Validator
    except ImportError as e:  # pragma: no cover
        print(f"validate.py needs pyyaml + jsonschema ({e}). Install: pip install pyyaml jsonschema", file=sys.stderr)
        return 2

    schema = json.loads((ROOT / "schema" / "experience.schema.json").read_text())
    defs = schema["$defs"]

    def validator_for(defname):
        return Draft202012Validator({"$ref": f"#/$defs/{defname}", "$defs": defs})

    collections = [
        ("_data/stories.yml", "story", "story"),
        ("_data/wordgames.yml", "anyGame", "word-game"),
    ]

    errors: list[str] = []
    for path, defname, label in collections:
        full = ROOT / path
        if not full.exists():
            errors.append(f"{path}: missing")
            continue
        items = yaml.safe_load(full.read_text()) or []
        if not isinstance(items, list):
            errors.append(f"{path}: expected a list of {label}s")
            continue
        v = validator_for(defname)
        for i, item in enumerate(items):
            ident = item.get("id", f"[{i}]") if isinstance(item, dict) else f"[{i}]"
            for err in sorted(v.iter_errors(item), key=lambda e: list(e.path)):
                loc = "/".join(str(p) for p in err.path) or "(root)"
                errors.append(f"{path} · {label} '{ident}' · {loc}: {err.message}")

    if errors:
        print(f"experience-schema: {len(errors)} violation(s):\n", file=sys.stderr)
        for e in errors:
            print(f"  ✗ {e}", file=sys.stderr)
        print("\nGenerated content must conform to schema/experience.schema.json. "
              "A new field or experience type is a human-gated class change, not an instance.", file=sys.stderr)
        return 1

    stories = yaml.safe_load((ROOT / "_data/stories.yml").read_text()) or []
    games = yaml.safe_load((ROOT / "_data/wordgames.yml").read_text()) or []
    print(f"experience-schema: OK — {len(stories)} stories + {len(games)} word-games conform to the schema.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
