# NavigationBar

## Purpose

Expose the primary destinations of an application or website in a horizontal bar.
Each item links to a URL that the user can open, bookmark, or revisit through browser history.

## API

| Option | Description |
| --- | --- |
| `label` | Accessible name that distinguishes the navigation landmark from other navigation. |
| `brand` | Optional product name or brand link with an accessible name. |
| `items` | Ordered destinations, each with a visible label and a URL. |
| `current` | Optional destination that matches the current route or location. |

## Behavior and accessibility

- Use a named native navigation landmark with links. Support Tab, Shift+Tab, and Enter.
- Derive the current destination from the route. Set `aria-current="page"` for page
  navigation or `aria-current="location"` for in-page destinations. Mark at most one
  destination as current.
- Provide default, hover, pressed, focus-visible, and current states. Underline the
  current destination so that its state is distinguishable independently of color.
- Wrap the links to new lines as space decreases. Keep links in reading order and
  provide a minimum 48 px block size per target. Allow long labels to wrap.
- Use the strong semantic glass surface with glass border, highlight, shadow, and
  medium blur. Use an opaque semantic surface when backdrop filtering is unavailable
  or the user prefers reduced transparency. Keep the indicator and focus visible in
  both themes and in forced colors.

See the [navigation pattern](../patterns/navigation.md) for placement in an application.
