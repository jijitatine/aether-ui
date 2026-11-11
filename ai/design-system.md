# Aether UI — system context

## Product intent

Aether UI is an original, framework-independent design system inspired by the clarity,
hierarchy, layered depth, and platform sensitivity associated with high-quality native
interfaces. Its glass language takes cues from iOS without copying Apple components,
assets, or proprietary patterns.

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
- Neutral content surfaces with one restrained accent role.
- The **Atlantique** semantic palette uses petrol blue for accent, mineral green for
  success, warm amber for warning, and raspberry red for danger. Light-theme values are
  contrast-tuned; dark-theme values stay brighter for legibility on deep surfaces.
- Translucent glass communicates hierarchy: navigation, floating controls, overlays, and
  elevated groups. It is not the default background for dense reading content.
- Glass always combines a semantic glass color, blur token, highlight border, and a
  tested fallback. Do not recreate the effect with arbitrary opacity values.
- Background color and restrained gradients may show through glass to make depth legible.
  They must never reduce content contrast or become the sole carrier of meaning.
- Comfortable density by default. Compact density must preserve accessible targets.
- Motion durations from the token scale and no essential information conveyed by motion.
- Light and dark themes are equal deliverables.

## Glass material rules

Use `semantic.glass-surface` for regular translucent layers and
`semantic.glass-surface-strong` when content needs more separation. Pair them with
`semantic.glass-border`, `semantic.glass-highlight`, `shadow.glass`, and the appropriate
`glass.blur.*` token.

Keep forms, tables, long text, and critical status content on an opaque or strong surface
unless contrast is proven over every possible background. Provide an opaque fallback for
browsers without backdrop filtering and for reduced-transparency preferences. Nested glass
should be rare: increase surface strength rather than stacking multiple blur layers.

## Definition of Aether UI compliance

A screen is compliant only when it uses semantic roles, existing contracts, complete
states, native semantics, responsive behavior, both themes, and the checks in
`ai/review-checklist.md`. Visual resemblance alone is not compliance.
