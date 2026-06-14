# AGENTS.md

This file defines how humans and AI coding assistants should work inside the Tofu Driver project.

## Product Principles

Tofu Driver is a smooth-driving game and safety-positioned experiment. Preserve these constraints:

- Reward smoothness, not speed.
- Never encourage looking at the screen while driving.
- Keep Basic Mode usable without location access.
- Keep Qualified Run Mode opt-in.
- Do not upload raw motion, GPS, speed, map, route trace, or street-level data.
- Keep scoring deterministic and explainable.
- Keep the app usable as a static frontend unless a backend is explicitly added later.

## Development Rules

- Read nearby files before editing.
- Keep changes scoped to the requested feature or fix.
- Prefer plain browser APIs over new dependencies.
- Keep privacy-sensitive behavior local-first.
- Do not add tracking, accounts, payments, backend writes, or network calls unless explicitly requested.
- Do not add safety claims that imply certification, insurance, legal compliance, or real-world driving protection.

## Documentation Rules

Update the relevant markdown files when behavior changes:

- `DESIGN.md`: durable product, privacy, and scoring contract
- `PLAN.md`: active next steps
- `README.md`: setup and validation commands
- `DEPLOYMENT.md`: hosting/deploy instructions

Keep docs short and specific to Tofu Driver.
