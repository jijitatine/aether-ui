# ProgressBar

Show how much of a known task has completed. Use a named native progress element
on the web.

| Option | Description |
| --- | --- |
| `label` | Accessible name describing the task. |
| `value`, `max` | Completed work and total work. The maximum is positive and the value is between zero and the maximum. |

Show a numeric percentage when users need the exact value. Keep the indicator
readable at zero and at completion and use semantic accent and track colors.
A progress bar is read-only. Announce meaningful milestones rather than each
increment of a continuously updating task. For an unknown duration use
[ProgressSpinner](progress-spinner.md).
