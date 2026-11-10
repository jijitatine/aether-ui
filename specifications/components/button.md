# Button

## Purpose
Triggers an action, never used for navigation (use Link).

## API
- `variant`: primary | secondary | ghost | destructive
- `size`: small | medium | large
- `disabled`: boolean (default false)
- `loading`: boolean (default false)
- `iconStart`, `iconEnd`: optional decorative or labeled icons
- `fullWidth`: boolean (default false)
- `type`: button | submit | reset (default button)

## Size tokens
small 32px, medium 40px, large 48px; increase hit target where needed. Radius 10px.

## States
Default, hover, pressed, focus-visible, disabled, loading. Disabled and loading must prevent duplicate action dispatch. Loading preserves button width and provides an accessible status.

## Keyboard and accessibility
Native `<button>` on web. Enter and Space activate. Visible focus ring. Accessible name required; icons alone need a label. Use semantic colors and check contrast.
