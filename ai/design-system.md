# Aether UI — system context

## Product intent

Aether UI is an original, framework-independent design system inspired by the clarity,
restraint, hierarchy, and platform sensitivity associated with high-quality native
interfaces. It does not copy Apple components, assets, or proprietary patterns.

The system exists to make interface decisions predictable for designers, developers,
Claude, Codex, and other agents. A generated screen should feel calm and familiar while
remaining recognizably Aether UI.

## Principles

1. **Clarity** — content hierarchy and the primary action are immediately legible.
2. **Restraint** — color, elevation, and motion communicate meaning, not decoration.
3. **Consistency** — the same semantic role produces the same visual and behavioral result.
4. **Adaptability** — layouts work across viewport, input method, theme, and platform.
5. **Accessibility** — keyboard, touch, zoom, contrast, assistive technology, and reduced
   motion are design inputs, not follow-up tasks.

## Architecture

| Layer | Location | Responsibility |
| --- | --- | --- |
| Foundations | `tokens/core/` | Raw scales: color, type, spacing, radius, motion, shadow |
| Semantics | `tokens/semantic/` | Theme-aware roles consumed by product UI |
| Components | `tokens/components/` | Decisions shared by a specific component |
| Contracts | `specifications/components/` | Framework-neutral API, state, behavior, accessibility |
| Patterns | `specifications/patterns/` | Composition guidance across multiple components |
| Adapters | `packages/` | Thin, platform-idiomatic implementations |
| Documentation | `docs/` | Visual reference and interactive examples |

## Decision priority

When sources conflict, use this order and report the conflict:

1. accessibility and user safety;
2. component or pattern contract;
3. semantic tokens;
4. component tokens;
5. core tokens;
6. local implementation preference.

## Visual language

- System font stack and strong typographic hierarchy.
- Neutral surfaces with one restrained accent role.
- Subtle borders and elevation; no gratuitous glass, gradients, or shadows in product UI.
- Comfortable density by default. Compact density must preserve accessible targets.
- Motion durations from the token scale and no essential information conveyed by motion.
- Light and dark themes are equal deliverables.

## Definition of Aether UI compliance

A screen is compliant only when it uses semantic roles, existing contracts, complete
states, native semantics, responsive behavior, both themes, and the checks in
`ai/review-checklist.md`. Visual resemblance alone is not compliance.
