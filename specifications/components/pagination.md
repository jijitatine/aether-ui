# Pagination

Use a labelled navigation region with previous and next arrow buttons with accessible names, numbered page buttons, a visible range and total, and a labelled Aether Select for page size. Mark the active page with aria-current=page and disable controls at the boundaries. Keep focus on the activated control or an available adjacent control. On narrow screens, show the current page and total instead of numbered buttons.

Apply filtering and sorting before pagination. Reset to the first page when filters or page size change and clamp the current page when the result count shrinks. Hide the navigation for empty results. Use the existing Button styling and semantic surface, text, border and accent tokens.

The Table demo composes pagination in a separate block below the table card and its state controls.
