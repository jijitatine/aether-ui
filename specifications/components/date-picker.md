# DatePicker

## Purpose

Select one calendar date for a form.

| Option | Description |
| --- | --- |
| `name`, `label` | Field name and persistent visible label. |
| `value` | An ISO calendar date (`YYYY-MM-DD`) or an empty value. |
| `min`, `max` | Optional inclusive date bounds in the same format. |
| `required`, `disabled`, `readOnly` | Native form states where supported by the platform. |
| `description`, `error` | Optional instructions or a validation message associated with the field. |

Use a native date input or the Aether calendar on the web. Use the platform date picker in native apps.
The presentation follows platform and locale conventions. Store the date without
a time or time zone. Validate bounds on the receiving side as well as in the form.

Provide keyboard and touch access, visible focus, and a text message for validation
errors. Associate the label and message with the input. Set `aria-invalid` when
showing a validation error. Use semantic surface, border, text, accent, and
danger tokens for the field in both themes.

See [TimePicker](time-picker.md) for local time selection.

## Aether calendar variant

The web documentation also provides a non-modal calendar popover with explicit confirmation.
Anchor it to the field, opening above when more space is available there. Constrain
the panel to the viewport and allow internal scrolling on short screens.
Start focus on the selected day or today. Arrow keys move by day or week, Home and End
move within the week, Page Up and Down switch months, and Shift with Page Up or Down
switches years. Escape and Cancel discard draft changes and restore trigger focus. Clicking or
tabbing away also dismisses the draft and leaves focus at its destination.
