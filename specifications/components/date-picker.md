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

The web documentation also provides a modal calendar with an explicit confirmation.
Start focus on the selected day or today. Arrow keys move by day or week, Home and End
move within the week, Page Up and Down switch months, and Shift with Page Up or Down
switches years. Escape or Cancel discards draft changes and restores trigger focus.
