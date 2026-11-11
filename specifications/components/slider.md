# Slider

Choose a numeric value within a bounded range. Use a native range input on the web.

| Option | Description |
| --- | --- |
| `name`, `label` | Form name and visible accessible label. |
| `min`, `max`, `step` | Bounds and positive increment. |
| `value` | Current numeric value, aligned to the step and within the bounds. |
| `disabled` | Disables interaction when the value cannot be changed. |

Expose the current value and show the unit when relevant. Preserve native pointer,
touch and keyboard input, including arrow keys and Home and End where supported.
Use the semantic accent and a visible focus ring in both themes.
