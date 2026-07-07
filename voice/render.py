#!/usr/bin/env python3
"""
render.py — the build-time voice pipeline (PRD 0003 milestone 1).

Renders a bounded set of already-approved spoken phrases into small static mp3
clips, once per voice, using Sarvam AI TTS (Indian-language-first). The player
plays a clip when one exists for the active voice and falls back to the device
voice otherwise — so partial coverage is fine and grows over time.

- Clips → assets/voice/<voice>/<slug>.mp3   (committed, served offline)
- Manifest → _data/voices.json  { voices: [...], manifest: { voice: {slug:1} } }
  (embedded into the page by _layouts/child.html so the player needs no fetch)

Idempotent: existing clips are skipped. Needs SARVAM_API_KEY in the env.
Run: SARVAM_API_KEY=... python voice/render.py   (or the gardener-voice workflow)

The slug + deterministic sentence-choice here MUST match assets/js/player.js.
"""
from __future__ import annotations
import base64, json, os, re, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.sarvam.ai/text-to-speech"

VOICES = ["ritu", "kavya", "priya", "pooja", "shreya"]   # expressive Sarvam bulbul:v3 speakers; ritu = default (owner pick), a sweet, playful, Mary-Poppins-ish read
ART = ["sun", "bird", "dog", "cat", "fish", "moon", "star", "flower", "cloud",
       "butterfly", "duck", "apple", "ball", "rain", "tree", "boat", "car"]
SENTENCES = ["Look, the {w}!", "It's the {w}!", "There's the {w}!", "I see the {w}!", "Can you say {w}?"]


def slug(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def sentence_for(word: str) -> str:
    idx = sum(ord(c) for c in word) % len(SENTENCES)      # deterministic per word (matches player.js)
    return SENTENCES[idx].replace("{w}", word)


def render_set() -> dict[str, str]:
    """slug -> exact text to speak."""
    out = {}
    for w in ART:
        t = sentence_for(w)
        out[slug(t)] = t
    for t in ["Peek-a-boo!", "Peek-a-boo! It's you!", "one", "two", "three", "four",
              "Hello, little one!"]:                        # phrases + a per-voice preview greeting
        out[slug(t)] = t
    return out


def tts(text: str, speaker: str, key: str) -> bytes:
    body = json.dumps({
        "text": text, "target_language_code": "en-IN", "model": "bulbul:v3",
        "speaker": speaker, "pace": 1.1, "temperature": 0.95, "output_audio_codec": "mp3",
    }).encode()
    req = urllib.request.Request(API, data=body, headers={
        "api-subscription-key": key, "content-type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.loads(r.read())
            return base64.b64decode(data["audios"][0])
        except urllib.error.HTTPError as e:
            if (e.code == 429 or e.code >= 500) and attempt < 3:   # rate-limit or transient server error
                time.sleep(2 * (attempt + 1)); continue
            raise RuntimeError(f"Sarvam {e.code}: {e.read()[:200]!r}")
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 3:
                time.sleep(2 * (attempt + 1)); continue
            raise RuntimeError(f"Sarvam network error: {e}")
    raise RuntimeError("unreachable")


def main() -> int:
    key = os.environ.get("SARVAM_API_KEY")
    if not key:
        print("SARVAM_API_KEY not set", file=sys.stderr); return 2

    rset = render_set()
    manifest: dict[str, dict[str, int]] = {}
    rendered = skipped = 0
    for voice in VOICES:
        vdir = ROOT / "assets" / "voice" / voice
        vdir.mkdir(parents=True, exist_ok=True)
        manifest[voice] = {}
        for s, text in rset.items():
            manifest[voice][s] = 1
            clip = vdir / f"{s}.mp3"
            if clip.exists() and clip.stat().st_size > 0:
                skipped += 1; continue
            clip.write_bytes(tts(text, voice, key))
            rendered += 1
            print(f"  ✓ {voice}/{s}.mp3")

    (ROOT / "_data" / "voices.json").write_text(
        json.dumps({"voices": VOICES, "manifest": manifest}, indent=2) + "\n")
    print(f"voice render: {rendered} rendered, {skipped} skipped; {len(rset)} phrases × {len(VOICES)} voices; manifest → _data/voices.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
