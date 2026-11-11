# ProgressSpinner

Show ongoing work when its completion percentage is unknown.

| Option | Description |
| --- | --- |
| `active` | Whether the operation is ongoing. |
| `label` | Text describing the operation or its current status. |

Use a decorative spinner alongside a text status. Announce meaningful changes
with a polite live region when the task starts or ends. Mark the region being
updated with `aria-busy` when appropriate. Use the semantic accent and the
motion scale. Under reduced motion, keep a static indicator and the status text.
For a known percentage use [ProgressBar](progress-bar.md).
