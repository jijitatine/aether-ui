# UI generation rules

## Before implementation

1. Restate the user task and target platform.
2. List the Aether UI components and patterns needed.
3. Read their contracts and the tokens they reference.
4. Identify missing components, variants, tokens, or ambiguous behavior.
5. If a gap exists, propose the smallest framework-neutral extension before coding it.

## During implementation

1. Use semantic tokens in application UI; never hardcode theme-dependent values.
2. Prefer an existing component and its documented variants.
3. Use native elements and platform conventions where they preserve the contract.
4. Implement every state required by the contract, including loading, disabled, empty,
   error, selected, or destructive states where relevant.
5. Provide accessible names, relationships, status announcements, focus management, and
   keyboard behavior.
6. Build responsive behavior from content needs. Do not assume desktop input or width.
7. Respect theme changes, zoom, high contrast, and reduced motion.
8. Keep business logic, data access, and visual presentation separated.

## Prohibited shortcuts

- Arbitrary hex, pixel, shadow, duration, or font values when a token exists.
- Clickable `div` or `span` elements in place of native controls.
- Color-only status, placeholder-only labels, hidden focus, or disabled controls without
  an explanation when one is needed.
- New component variants introduced only to match one screenshot.
- Claims that an adapter is implemented when its package contains guidance only.

## Completion response

Report the contracts and tokens used, the states covered, any deliberate extension, and
the verification performed. Then evaluate the result with `ai/review-checklist.md`.
