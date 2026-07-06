# The Review Council

The reviewer agent from **PRD 0003 (The Generative Arc)** — a panel of
rubric-anchored LLM judges that reviews one generated artifact and returns
**publish / revise / escalate**. Charter: `knowledge-base/COUNCIL.md`.

- **`review.py`** — six "seats" (Explorer · Skills · Voice · Tone · Guardian ·
  Lap) run **in parallel and independently** (Anthropic SDK, `claude-opus-4-8`,
  structured outputs), each bound to specific KB pages (its *constitution*) and
  required to cite the principle that passes or fails. A fixed **Chairman**
  synthesizes the six verdicts; the decision is computed **deterministically**
  from the verdicts (`decision_from`) — the model never overrides the gate.
- **`.github/workflows/council.yml`** — manual `workflow_dispatch`; review a
  story (`story_id`) or word-game (`game_id`); writes the report to the run's
  job summary. Build-time only; never runs on the child's device.

## Run it

Locally (assemble prompts, no API calls, no key needed):

```
python council/review.py --story chatter-chatter --dry-run
```

For real (needs `ANTHROPIC_API_KEY`; ~7 calls, a few cents):

```
python council/review.py --story chatter-chatter        # or --game who-says
```

Exit codes encode the gate: **0** publish · **20** revise · **30** escalate.

## Status
Review-mode built (this is milestone 2 of PRD 0003). Selection mode (best-of-N
variants) and the CLHF calibration loop (owner overturns → seat exemplars in
`COUNCIL.md`) are the next steps. Multi-model seats and a committed KB ledger
are recorded fast-follows.
