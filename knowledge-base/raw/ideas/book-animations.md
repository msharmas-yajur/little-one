# Idea — real board-book animations (page-turn + peek-a-boo flaps)

Owner idea (2026-07): make the online books feel like real board books.
1. **Page-turn animation** when advancing/going back a story page (not an instant
   swap).
2. **Lift-the-flap peek-a-boo** in *some* books: "Where's [animal]?" → tap/lift a
   flap → "There she is!" reveal + name. Reference video (Felt Flaps "Where's Mrs
   Cat?"): `raw/research/videos/felt-flaps-peekaboo.md`.

## Constraints (carry into the spec)
- **Original art only** — recreate the *mechanic*, never the book's illustrations
  (`design-principles.md`).
- **Forgiving & gentle** — soft, unhurried motion; respect `prefers-reduced-motion`
  (fall back to instant swap).
- **Lap activity** — big tap targets; the reveal is a shared delight.
- Vanilla JS/CSS, no libraries (keeps the no-build-step rule).

## Why it fits
- Page-turn: the felt-book "turn" is part of the ritual and pacing.
- Peek-a-boo: object permanence + anticipation + naming; peek-a-boo → memory &
  trust (`videos/thrive-by-five-molly-wright.md`); ties to arc Month 2.

→ Compiled to `wiki/features/page-turn-animation.md` and
`wiki/features/peekaboo-flaps.md`.
