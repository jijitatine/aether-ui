# Select

## Purpose
Chooses one or several values from a predictable list without exposing the browser's
default option menu when the Aether visual treatment is required.

## API
- `options`: ordered collection of `{ value, label, leadingVisual?, disabled? }`
- `value`: selected value or null in single mode
- `values`: selected values in multiple mode
- `multiple`: boolean (default false)
- `placeholder`: visible prompt when no value is selected
- `variant`: default | error
- `size`: small | medium | large
- `disabled`: boolean (default false)
- `required`: boolean (default false)
- `name`: optional form field name
- `errorMessage`: optional text linked to the trigger

## States
Closed, open, focused option, selected, error, disabled, empty, and multiple selected.

## Behavior and accessibility
Use a native button as the trigger with `aria-haspopup="listbox"`, `aria-expanded`, and
`aria-controls`. The popup uses `role="listbox"`; each option uses `role="option"` and
`aria-selected`. In multiple mode, the popup also uses `aria-multiselectable="true"`.
A persistent label names the trigger. Error text is connected with `aria-describedby`,
and `aria-invalid` mirrors the error state.

`leadingVisual` is an optional decorative or informative slot before the label: for
example a country flag, avatar, provider logo, or icon. The text label must remain
available; a flag or icon can never be the only way to identify an option.

- Enter, Space, ArrowDown, or ArrowUp opens the list.
- ArrowDown and ArrowUp move between enabled options; Home and End jump to the bounds.
- In single mode, Enter or Space selects the focused option, closes the list, and restores
  trigger focus.
- In multiple mode, Enter, Space, or click toggles the focused option and keeps the list
  open. Escape, outside click, or Tab closes it; the trigger summarizes the selected labels.
- Escape closes without changing the value and restores trigger focus.
- Clicking outside closes without changing the value.
- Disabled triggers and options cannot be activated.

Never rely on color alone. Ensure light/dark contrast, preserve a 44 px touch target,
use semantic tokens, and respect reduced motion and reduced transparency.

## Implementation guidance
Prefer the native platform picker when it offers the better platform experience. Use the
documented custom listbox only when Aether styling is required, and keep form submission
synchronized through an adapter-owned value or hidden input. For multiple mode, define
whether the adapter submits repeated values, an array, or a serialized list. Add
component-specific interaction tests before publishing.
