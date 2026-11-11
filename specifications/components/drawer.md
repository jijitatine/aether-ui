# Drawer

A modal edge panel for viewing or editing a record while retaining the surrounding page as visual context.

| Option | Description |
| --- | --- |
| `open` | Open or closed state |
| `title` | Visible heading that names the panel |
| `content` | Details or an editable form |
| `onClose` | Close action. Form submission and destructive confirmation belong to the host flow. |

On web, use a native modal dialog with an accessible name. Give initial focus to the close control, contain keyboard focus within the panel, and return it to the opener when closed. When a mutation removes the opener, return focus to a relevant surviving action. Support a named close button and Escape. Use a separate confirmation dialog for destructive actions.

Use the semantic surface, border and text, the glass shadow token, and the normal motion token. Slide in from the right on wide screens and from the bottom on narrow screens. Respect reduced motion and the bottom safe area. Keep overflowing content scrollable within the panel. The panel uses the opaque semantic surface in both themes.
