# Aether UI agent contract

This repository is the source of truth for Aether UI, an Apple-inspired but original,
framework-independent design system. These instructions apply to Codex and any other
coding agent operating in the repository.

## Mandatory reading order

Before implementing or reviewing UI:

1. Read `ai/design-system.md` for principles and decision priority.
2. Read `ai/generation-rules.md` for the required workflow.
3. Read the relevant files in `tokens/core/`, `tokens/semantic/`, and
   `tokens/components/`.
4. Read every applicable contract in `specifications/components/` and pattern in
   `specifications/patterns/`.
5. Use `ai/review-checklist.md` before declaring the work complete.

For an end-to-end explanation and example prompts, read `ai/integration-guide.md`.

## Non-negotiable rules

- Use semantic tokens in product UI. Never introduce an arbitrary color, spacing,
  radius, shadow, duration, or typography value when a token exists.
- Preserve the documented component API, states, semantics, and keyboard behavior.
- Prefer native platform elements and semantics before recreating behavior.
- Support light and dark themes, keyboard and touch, responsive layouts, zoom, and
  `prefers-reduced-motion`.
- Build translucent layers only from the documented glass tokens. Glass must express
  hierarchy, preserve contrast, honor reduced transparency, and have an opaque fallback.
- Never silently invent a component, variant, size, or interaction. Report the gap and
  propose a documented extension first.
- Keep framework adapters thin. Business rules never belong in visual components.
- Accessibility requirements override visual convenience. Report any conflict.

## Implementation protocol

In the response or change summary, state:

1. which Aether UI contracts and tokens were used;
2. which required states were implemented;
3. any missing token, component, or ambiguous rule;
4. how the result was verified.

When adding or changing a component, update all affected layers:

- token source when a new reusable decision is required;
- framework-neutral specification;
- visual documentation in `docs/`;
- adapter implementation, when in scope;
- tests and the AI review checklist where applicable.

## Repository commands

```bash
python3 scripts/build_css.py
python3 scripts/prepare_pages.py
python3 -m unittest discover -s tests
```

Generated CSS must not be edited directly. Change the JSON tokens, then rebuild.
