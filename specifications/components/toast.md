# Toast

Briefly confirms an action or reports its outcome near the edge of the screen.

| Property | Contract |
| --- | --- |
| `tone` | `info`, `success`, `warning`, or `danger` |
| `title` | Short, visible summary |
| `message` | Optional detail |
| `duration` | 6 seconds for brief information and success by default. Warning and danger stay visible until dismissed. |

Use one toast at a time. A new message replaces the previous one. Keep any
information users need to recover from a problem available in the affected
content through an Alert.

Show the toast without moving focus. Announce updates through a live region
already present in the document. Use polite announcements for routine messages
and assertive announcements for immediate failures. Include a named native
close button. Pause auto-dismiss while the pointer or focus is inside, and restart
the delay when both leave. If dismissal removes the focused button, restore
focus to the trigger when it is still available.

Use the semantic status colors for icons and the strong glass surface for the
floating layer. Provide the opaque semantic surface for reduced transparency
or unavailable backdrop filtering. Respect reduced motion and mobile safe areas.
