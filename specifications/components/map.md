# Map

Use Map to locate and compare a set of places on a geographic overview. In a
dashboard, place the map in a Card with a title and keep the place details beside
it on wide layouts and below it on narrow layouts.

| Input | Contract |
| --- | --- |
| `title` | Visible geographic scope or purpose. |
| `places` | Places with a unique ID, a name, latitude, longitude and optional descriptive text. |
| `selectedId` | Optional ID of the active place. Selecting a marker or its matching list entry updates the same ID. |
| `bounds` | Initial extent of the geographic overview. Reset restores this extent. |
| `attribution` | Visible credits as required by the map data provider. |

Use the same visible identifier on each marker and its list entry. Make both
native buttons with a visible focus ring and a selected state conveyed through
shape or an indicator as well as color. Use the semantic surface, border, text
and accent roles. Keep labels and controls readable in both themes.

Show the selected place in a stable details area and announce a selection change
politely without moving focus. The place list provides access to all details
independently of the map viewport. Keep names and descriptions readable even
without script. Hide the duplicate geographic drawing from assistive technology
when the title and place list convey the purpose.

If zoom is available, provide labelled zoom buttons and a reset action. Provide
keyboard access to the viewport and use native scrolling at zoomed levels.
Preserve page scrolling and browser pinch zoom. Keep marker and control targets
at least 48 CSS pixels in the documentation example. Avoid animated panning.

For asynchronous sources, display loading and error messages and retain the list
if place data is available. Show an explicit empty message when there are no
places. The documentation uses a local, static Natural Earth overview and sample
locations. It is intended for visualization at country scale.

## Street map

Use a street map when the user needs to explore local streets, parks and points
of interest. Supply an initial center and zoom or bounds, plus an optional marker
whose location is named in text outside the map. The provider handles panning and
zoom in this variant. Choose a provider with keyboard and touch controls, and
keep its attribution and controls visible.

Give an embedded frame a descriptive accessible title. Keep the place name,
credits and a direct link to the provider visible outside the frame. The link
remains available while the map loads and if embedded content is blocked. Use
Aether's semantic colors for the surrounding card. The provider controls the
embedded map's palette. The documentation example uses a lazy-loaded
OpenStreetMap embed and requires a network connection to display the street map.
