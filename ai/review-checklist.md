# Aether UI review checklist

## Source compliance

- [ ] Relevant component and pattern contracts were read and named.
- [ ] Component API, variants, sizes, and states match the specifications.
- [ ] Semantic tokens are used throughout product UI.
- [ ] No undocumented token, variant, or interaction was introduced silently.
- [ ] Generated token outputs were rebuilt rather than edited directly.

## Interaction and states

- [ ] Default, hover, pressed, focus-visible, disabled, and loading states are covered where applicable.
- [ ] Empty, error, success, destructive, selected, and read-only states are covered where applicable.
- [ ] Repeated actions are prevented while loading or disabled.
- [ ] Focus is moved, contained, and restored correctly for overlays and dynamic flows.
- [ ] Status and validation changes are announced when needed.

## Accessibility

- [ ] Native semantics are used wherever possible.
- [ ] Every control has a persistent accessible name.
- [ ] Keyboard navigation and visible focus are complete.
- [ ] Meaning never relies on color alone.
- [ ] Contrast is audited for every text/background and state pairing.
- [ ] Touch targets and spacing remain usable.
- [ ] Content remains usable at 200% zoom and with larger text.

## Adaptability and quality

- [ ] Light and dark themes were checked.
- [ ] Mobile, intermediate, and wide layouts were checked.
- [ ] Reduced-motion preferences are respected.
- [ ] Content works with long labels and realistic data.
- [ ] Business logic remains separate from visual components.
- [ ] Relevant automated tests and build commands pass.
