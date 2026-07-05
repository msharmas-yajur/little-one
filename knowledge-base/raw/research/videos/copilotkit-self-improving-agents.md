# Video note — "CopilotKit: What If Your AI Agent Could Improve Itself?"

> Raw source (video). Reference for the owner's self-learning-systems concept.
> Summarized from the video title + CopilotKit's published product material (see
> Sources); we adopt the *pattern*, not the library.

## What it is
- **Video:** https://www.youtube.com/watch?v=TvUWDQ21y4w — CopilotKit on
  self-improving agents.
- **Core mechanic:** "Self-Learning" via **continuous learning from human
  feedback (CLHF)** — a form of **in-context reinforcement learning**. User
  feedback on agent interactions is distilled into instructions/memory that are
  injected into the agent's *context* on future runs. **The model's weights
  never change; the context it reads changes.** No fine-tuning.
- CopilotKit itself is a React front-end + backend runtime for in-app agents —
  it needs a server, so the *library* doesn't fit this static site. The
  *pattern* transfers completely.

## Why this matters to Little One
The pattern is exactly the project's architecture, independently arrived at:

| CopilotKit CLHF | Little One equivalent |
|---|---|
| Agent = fixed model | Claude (authoring) + the player engine (runtime) — both fixed |
| Mutable context injected per run | The **knowledge base** (evidence, policy, heuristics as data) |
| User feedback distilled into context | Noticing-prompt responses + owner observations → dyad heuristics (fast, on-device) and KB updates (slow, reviewed) |
| Continuous improvement without retraining | The site improves by **editing data**, never the engine |

**The unifying principle: learning lives in the knowledge/context layer, not in
model weights.** This is also the answer to the "changing medical protocols"
problem the owner wants to practice: guidance-as-context means a protocol change
is a data edit with provenance and diff — not a model retrain or code rewrite.

## Our three-tier version of "self-learning" (see wiki/concepts/adaptive-arc.md)
1. **On-device, real-time (fully automated):** dyad heuristics — counters and
   preferences adjust the served arc locally. Private by construction.
2. **Build-time, automated with a human gate:** feedback and observations are
   distilled (by Claude) into KB/policy/content updates delivered as **pull
   requests**; review is the safety gate. A scheduled job can drive this loop.
3. **Evidence loop:** new research ingested into the KB updates guidance with
   provenance, versions, effective dates.

## Sources
- https://www.youtube.com/watch?v=TvUWDQ21y4w — the video.
- https://www.copilotkit.ai/product — Self-Learning / CLHF, "agents automatically improve from user interactions, no model fine-tuning required."
- https://www.copilotkit.ai/ — platform overview.

## Caveat
Interaction-design reference; not affiliated. Adopt the in-context-learning
pattern; do not adopt runtime agent calls on the public child-facing site.
