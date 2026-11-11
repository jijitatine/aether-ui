# Chart

Show a trend, compare categories or display parts of a whole.

| Variant | Data and scale |
| --- | --- |
| `line` | Ordered observations on a labelled scale. Space points by their actual interval and leave a gap where a value is missing. |
| `bar` | Named categories on a shared scale with a zero baseline. |
| `donut` | Non-negative parts of one total. Label each part and state its value or share. Use the empty state when the total is zero. |

Supply a title, labelled data, units and any context needed to interpret the
scale. Offer the exact values as a native table or a labelled list. Keep this
alternative available to keyboard, touch and assistive technology without
requiring a tooltip. If the accessible caption and data alternative convey the
graphic's information, hide duplicate drawing primitives from assistive technology.

Use an opaque semantic surface, text and border tokens for labels and guides,
and the semantic accent for a single series. For parts of a whole, pair each
series color with a visible label and value. Keep labels legible at narrow
widths and high zoom. Use the same scale and data in light and dark themes.

For asynchronous data, show explicit loading, empty and error messages. Offer
retry only when the host supports it. The documentation examples show the ready
state with static sample data.
