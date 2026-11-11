# Toggle

## Purpose
Turns an immediately applied setting on or off. Use Checkbox when the value is part of a
form that is submitted later.

## API
- `checked`: boolean
- `disabled`: boolean (default false)
- `label`: required visible label
- `description`: optional visible supporting text
- `name`: optional form field name
- `onChange`: callback receiving the next checked value

## States
Off, on, hover, pressed, focus-visible, and disabled.

## Behavior and accessibility
Use a native `<button type="button" role="switch">` on the web. `aria-checked` is the
source of truth and changes immediately after activation. The visible label names the
control; supporting text must remain available to assistive technology. Enter and Space
toggle the value. Disabled prevents activation. Never communicate state through color
alone: the thumb position and `aria-checked` must both change.

The entire labeled row may be the touch target when it represents only this setting.
Preserve visible focus, a minimum 44 px target, semantic colors, light/dark contrast,
reduced motion, and reduced transparency.

## Implementation guidance
Do not use Toggle for a destructive action, a multi-value choice, or an action requiring
confirmation. Adapters may use the native platform switch when it preserves this contract.
