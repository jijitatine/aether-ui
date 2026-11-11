# Alert

Displays a contextual message in the page, beside the section or task it affects.

| Property | Contract |
| --- | --- |
| `tone` | `info`, `success`, `warning`, or `danger` |
| `title` | Visible summary that communicates the state |
| `message` | Optional detail or recovery instructions |
| `dismissible` | Optional named close button for messages users may safely hide |

Alerts stay visible while relevant. Keep required recovery information in the
page until the problem is resolved. When a keyboard dismissal removes the
focused control, move focus to a nearby relevant control.

Use regular document semantics for alerts visible on initial load. Announce a
dynamically inserted urgent message with an alert live region, or a routine
update with a polite status region. Keep interactive controls outside that
live region. Pair the semantic status color with an icon and readable text.
Use an opaque surface with a restrained semantic tint in both themes.
