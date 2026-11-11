# TimePicker

## Purpose

Select one local clock time for a form.

| Option | Description |
| --- | --- |
| `name`, `label` | Field name and persistent visible label. |
| `value` | A local time (`HH:mm` at minute precision) or an empty value. |
| `min`, `max` | Optional inclusive bounds in the same time format. |
| `step` | Optional increment in seconds on the web. The default is 60 seconds. |
| `required`, `disabled`, `readOnly` | Native form states where supported by the platform. |
| `description`, `error` | Optional instructions or a validation message associated with the field. |

Use a native time input on the web and the platform time picker in native apps.
Respect the platform’s 12-hour or 24-hour display. Store a local clock time without
a time zone. When scheduling an instant, resolve the date, time, and applicable
time zone in the application. Use seconds in the value only when the use case
requires sub-minute precision.

Provide keyboard and touch access, visible focus, and a text message for validation
errors. Associate the label and message with the input. Set `aria-invalid` when
showing a validation error. Use semantic surface, border, text, accent, and
danger tokens for the field in both themes.

See [DatePicker](date-picker.md) for calendar date selection.
