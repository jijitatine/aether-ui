# MenuButton

## Purpose

Open a short menu of actions for the current context. Compose a [Button](button.md)
trigger with an action menu.

| Option | Description |
| --- | --- |
| `variant` | `icon`, `icon-text`, or `text`. |
| `label` | Accessible name for all variants. Display it in the two text variants. |
| `icon` | Decorative icon for the two icon variants. |
| `items` | Ordered action labels and their associated handlers. |
| `disabled` | Optional native disabled state for the trigger. |

Use the existing ghost button and semantic surface, border, accent, and text roles.
Keep the trigger and each menu item at least 48 px high in the web example.

## Behavior and accessibility

- Use a native button with `aria-haspopup="menu"`, `aria-expanded`, and
  `aria-controls`. Give the menu the trigger's accessible name.
- Open on click, Enter, Space, or Arrow Down and focus the first item. Arrow Up
  opens at the last item.
- Inside the menu, Arrow Up and Down cycle through the items. Home and End move to
  the first and last items. Enter or Space activates the focused item.
- Escape closes the menu and restores focus to the trigger. Tab and Shift+Tab
  leave the menu in normal tab order. A pointer action outside dismisses it.
- Activating an item closes the menu. Restore focus to the trigger before invoking
  an action unless the action itself moves focus to a new context.
- Keep focus and the expanded state visible in both themes. Hide decorative icons
  from assistive technology.
