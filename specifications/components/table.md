# Table

## Purpose

Compare structured records in rows and columns. Use an opaque semantic surface for
the data and visible text for status values.

## API

| Option | Values |
| --- | --- |
| `variant` | `default` or `striped`. Alternating rows use the muted semantic surface. |
| `density` | `comfortable` by default or `compact`. Compact reduces body cell padding and preserves control targets. |
| `columns` | Header labels, optional sortable flags, and optional numeric alignment. |
| `rows` | Records with a consistent set of cells and a row header when a cell identifies the record. |
| `sort` | Optional active column and `ascending` or `descending` direction. |
| `state` | `ready`, `loading`, `empty`, or `error`. |
| `disabled` | Disables applicable controls without changing the readability of the data. |

## Behavior

- Activate a sortable header to sort ascending. Activate it again to reverse the
  direction. A different column starts ascending.
- Sort dates and numbers by their underlying values. Sort text using the interface
  locale. Align numeric headers and cells consistently and use tabular numerals.
- Keep headers visible in loading, empty and error states. Announce the status in
  a live region and disable sorting while there are no data rows. Restore the
  current sort when rows return.

## Accessibility

- Use a native table with a caption, scoped column headers and scoped row headers
  where appropriate. Use native buttons within sortable headers so Enter and Space
  activate sorting and focus stays on the control.
- Set `aria-sort` only on the active column header and show the direction visually.
  Set `aria-busy` on the table while loading. Keep the live region outside the busy table.
- If columns overflow, scroll inside a labelled, keyboard-focusable region so all
  data remains available on narrow screens and at high zoom.
- Use semantic surface, muted surface, border, text and accent tokens in both
  themes. Preserve visible focus, readable contrast and usable control targets.

The interactive HTML example is in the visual documentation. Framework adapters
should preserve these semantics using their platform's idioms.
