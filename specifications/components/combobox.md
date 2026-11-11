# Combobox

A text field with single-selection suggestions. It accepts a label, a source of options, and a selection callback. An option has a primary label and optional supporting text. Keep free text separate from committed selection.

On web, use an editable input with role combobox, aria-expanded, aria-controls and aria-autocomplete=list. Use a listbox popup with options. Keep focus on the input and identify the active option with aria-activedescendant. Typing filters the list. Arrow keys move among options, Enter selects the active option, Escape closes, and Tab continues the normal focus order. Pointer selection invokes the same callback.

Show an empty state and announce result availability politely. Use an opaque semantic surface, border and text in both themes, with a visible focus indicator and scrollable results. The examples show up to eight suggestions.
