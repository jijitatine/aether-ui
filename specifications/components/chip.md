# Chip

A compact label, filter, or removable selection. Use short labels and let groups
wrap when space is limited.

| Variant | Semantics and behavior |
| --- | --- |
| `label` | Static text for a category or attribute. No tab stop. |
| `filter` | Native toggle button with a stable label and `aria-pressed`. A checkmark distinguishes the active state. |
| `removable` | Native button named “Remove [value]”. The entire chip removes the value. |

Use semantic surface, border, accent and text tokens. Keep a visible focus outline,
a comfortable touch target, and readable contrast in both themes. Enter and Space
activate interactive chips. After removal, move focus to a nearby remaining chip or
to the control that manages the selection. Announce the removal when its result
would otherwise be unclear to assistive technology.
