# Select

## Purpose
Chooses one value from a predictable list without exposing the browser's default option
menu when the Aether visual treatment is required.

## API
- `options`: ordered collection of `{ value, label, disabled? }`
- `value`: selected value or null
- `placeholder`: visible prompt when no value is selected
- `variant`: default | error
- `size`: small | medium | large
- `disabled`: boolean (default false)
- `required`: boolean (default false)
- `name`: optional form field name
- `errorMessage`: optional text linked to the trigger

## States
Closed, open, focused option, selected, error, disabled, empty.

## Behavior and accessibility
Use a native button as the trigger with `aria-haspopup="listbox"`, `aria-expanded`, and
`aria-controls`. The popup uses `role="listbox"`; each option uses `role="option"` and
`aria-selected`. A persistent label names the trigger. Error text is connected with
`aria-describedby`, and `aria-invalid` mirrors the error state.

- Enter, Space, ArrowDown, or ArrowUp opens the list.
- ArrowDown and ArrowUp move between enabled options; Home and End jump to the bounds.
- Enter or Space selects the focused option, closes the list, and restores trigger focus.
- Escape closes without changing the value and restores trigger focus.
- Clicking outside closes without changing the value.
- Disabled triggers and options cannot be activated.

Never rely on color alone. Ensure light/dark contrast, preserve a 44 px touch target,
use semantic tokens, and respect reduced motion and reduced transparency.

## Implementation guidance
Prefer the native platform picker when it offers the better platform experience. Use the
documented custom listbox only when Aether styling is required, and keep form submission
synchronized through an adapter-owned value or hidden input. Add component-specific
interaction tests before publishing.
