# DateRangePicker

Select an inclusive period using two [DatePicker](date-picker.md) fields. Each
value is a calendar date (`YYYY-MM-DD`) without a time zone.

| Option | Description |
| --- | --- |
| `start`, `end` | Start and end dates, with independent form names and visible labels. |
| `min`, `max` | Optional inclusive bounds for both fields. |
| `required` | Requires both dates. An optional period can be empty, but a partially filled period is invalid. |

- Give the fields a shared group name. Keep the tab order start, then end.
- Use the later of the start date and the overall minimum as the lower bound of
  the end field. Both dates may be identical.
- If an edit puts the end before the start, preserve the entered values and show
  a text error associated with the end field. Clear it once the order is valid.
- Reuse the DatePicker tokens, focus styles, native controls, and error semantics.
- Validate the dates and their order again on the receiving side.

## Aether calendar variant

Choose both endpoints in one calendar, including across months. The first selection
starts a draft and the second completes it. Reverse selections are normalized in
chronological order. Highlight the endpoints and days between them. Confirm only a
complete draft. Cancel or Escape preserves the previously confirmed selection.
Keyboard navigation follows the DatePicker calendar.
