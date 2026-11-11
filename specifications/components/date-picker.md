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

Use a native date input on the web and the platform date picker in native apps.
The presentation follows platform and locale conventions. Store the date without
a time or time zone. Validate bounds on the receiving side as well as in the form.

Provide keyboard and touch access, visible focus, and a text message for validation
errors. Associate the label and message with the input. Set `aria-invalid` when
showing a validation error. Use semantic surface, border, text, accent, and
danger tokens for the field in both themes.

See [TimePicker](time-picker.md) for local time selection.
