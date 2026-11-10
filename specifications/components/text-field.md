# TextField

## Purpose
Reusable framework-neutral TextField component.

## API
- `variant`: default, error
- `size` or `density`: small, medium, large
- `disabled`: boolean where applicable

## States
disabled, readonly, required, error, focus

## Behavior and accessibility
Use native semantics where possible. Keyboard operability, visible focus, accessible naming and correct disabled behavior are mandatory. Never rely on color alone. Ensure light/dark contrast. Use semantic tokens and respect reduced motion.

## Implementation guidance
Adapt the contract to platform idioms; preserve documented semantics and behavior. Add component-specific interaction tests before publishing.
