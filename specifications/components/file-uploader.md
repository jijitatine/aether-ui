# FileUploader

Select local files through a native file input. Optionally accept files dropped
onto the same area.

| Option | Description |
| --- | --- |
| `label`, `name` | Visible label and form field name. |
| `accept`, `multiple` | Supported file types and whether several files may be selected. |
| `maxBytes`, `maxFiles` | Optional per-file size and total file count limits. |
| `preview` | Optional thumbnail for supported image files. |

Show allowed formats and limits before selection. Report rejected files with
reasons and keep the accepted files in a list with names and sizes. Give each
remove button an accessible name. After removal, focus the next remove button,
the previous one, or the file input when the list becomes empty. Announce changes
politely and release preview URLs once their files are removed.

The demo selects files locally. When connected to an upload service, validate
accepted file types, sizes, and counts on the receiving side and report actual
upload progress or failures from the transport.
