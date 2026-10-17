# New text since your first-page rewrite (2 October 2026)

Everything below was added for the two new choices, **Search a marked part alone** and **Re-search a marked region**. Each item says **where** it appears and **where it is in the source** (`partial-builder.html`). Text built while the page runs shows its changing parts as `{…}`.

## ⚠ Two hints that are now inaccurate (please rewrite these first)

1. **The drawing panel's hint** (`<span id="regionHintText">`) says "Everything outside it stays exactly as in your partial." Since the change you asked for, only the rest of the partial **plus a two-cell border** stays fixed; other empty space is free, so the re-searched part can grow outside the rectangle.
2. **The same hint is shown for "alone"**, but two of its sentences don't apply there: "the rectangle must cover all of them" (alone only needs the rows *above* the rectangle to be valid) and "Everything outside it stays exactly as in your partial" (alone *ignores* everything outside). The two choices probably need separate hints.

## 1. Menu options
*Where:* card 2, **Where to cut** menu. *Source:* `<select id="cutAt">`.

- `alone`: Search a marked part alone (ignores the rest of the partial)
- `region`: Re-search a marked region (keeps the rest of the partial fixed)

## 2. Mode hints
*Where:* the grey line under the menus in card 2. *Source:* `TASK_HINT` near the end of the script.

- `alone`: Searches the part you mark on its own, like Back only: the search starts from the rows just above it and ignores everything else, so it is small and fast. The result may not fit back onto the ship if the part grows close to it. Not yet tested in rlife.
- `region`: Keeps every row of the partial and re-searches the part you mark (by default, the box around the errors). The rest of the partial and a two-cell border around it stay fixed through a constraint file; all other empty space is free, so the part can grow away from the ship. For a broken side branch or bump that the normal cut would throw the rest of the partial away for. Not yet tested in rlife.

## 3. Drawing panel
*Where:* the right column, when either choice is selected (the same panel as "Along drawn line"). *Source:* `#linePanel`; titles and button text are set in `run()`.

- **Panel title (alone):** Mark the part to search alone
- **Panel title (region):** Mark the region to re-search
- **Reset button:** Reset to the box around the errors
- **Hint (both choices; see the warning above):** Drag a rectangle over the part to re-search; it applies to every generation. Red dots are the errors, and the rectangle must cover all of them. Everything outside it stays exactly as in your partial. Before you draw, the rectangle is the box around the errors.

## 4. Stats panel
*Where:* the boxes at the top of the right column after a build. *Source:* `stat(...)` calls in `run()`.

- **Region** (re-search): `{drawn: | around the errors: | no errors found, so the back (mark a region to change it): }`lines {…} to {…}, columns {…} to {…}; {…} cells kept fixed (the rest of the partial and a two-cell border), {…} free
- **Marked part** (alone): `{drawn: | around the errors: }`lines {…} to {…}, columns {…} to {…}; searched alone, from the {…} lines above it
- **Edges** (alone; the same wording as Back only): can grow wider than the question marks / stay inside the question marks

## 5. Warnings
*Where:* amber banners above the stats. *Source:* `banner("warn", …)` in `run()`.

- This file holds just the marked part. The search ignores the rest of the partial, so check that the result still fits the ship before joining it on.
- Searching a marked part alone isn't available for this partial: {reason}
- Re-searching a marked region isn't available for this partial: {reason}

## 6. Error messages
*Where:* red banners when the choice can't be used. *Source:* `throw new Error(...)` in the core part of the script.

- Re-searching a marked region is built for orthogonal and knightwise ships, not diagonal ones yet.
- Re-searching a marked region is only available f2b.
- Re-searching a marked region needs the partial at full width, not a half cut at the axis.
- The marked region starts too close to the front of the partial; rlife needs a few known rows above it.
- {n} of the partial's {m} errors lie outside the marked region (around line {…}). Mark them too, or the fixed cells will contradict each other.
- Searching a marked part alone is built for f2b orthogonal and knightwise ships, not diagonal ones yet.
- Searching a marked part alone needs the partial at full width, not a half cut at the axis.
- This partial has no errors; mark the part to search alone.
- The marked part starts too close to the front of the partial; rlife needs a few known rows above it.
- There is an error above the marked part, in its columns (around line {…}). The search starts from the rows just above the part, so they must be valid: mark from higher up.

## 7. Guide section
*Where:* Guide tab, section 3, before "Recentering: extend and let it widen". *Source:* the `<h4>Search a marked part alone, or re-search it with the rest kept fixed</h4>` section in `<article id="guide">`.

#### Search a marked part alone, or re-search it with the rest kept fixed

For a partial that is valid except for one patch, such as a broken side branch near the front: the normal cut stops at the first error and throws away everything after it, the valid parts included. Two choices under **Where to cut** deal with this. Both open a panel where you drag a rectangle over the broken part; it applies to every generation. Red dots show the errors. Before you draw, the rectangle is the box around the errors.

- **Search a marked part alone (ignores the rest of the partial).** Like Back only, pointed at your rectangle: the search starts from the rows just above it, within its columns plus the padding, and ignores everything else in the file. It is small and fast, and the part can grow anywhere. But the search knows nothing about the rest of the ship, so if the part grows within a couple of cells of it, the result may not fit back on. The rows it starts from must be valid in those columns. The Back-only settings (lines to keep, padding, unrollable edges) apply.
- **Re-search a marked region (keeps the rest of the partial fixed).** Every row of the partial is kept. The start file has question marks from the top of your rectangle to the bottom, across the full width (rlife allows only one solid rectangle of question marks, reaching the bottom). A constraint file, `NAME-pre.cstr`, passed with `--constraint 'grid("NAME-pre.cstr", none)'`, fixes the rest of the partial plus a two-cell border of empty cells around it. Everything else is free, so the part can grow into empty space in any direction, but nothing new can come close enough to change the rest of the ship. The rectangle must cover every error. Slower than searching alone, but the result always fits the ship.

Both work for orthogonal (front to back) and knightwise ships, not yet for diagonal ones. **Neither has been tested in rlife yet.** The files pass the layout checks, the constraint file matches the start file exactly, and every fixed cell follows the rule; whether rlife treats the fixed cells as intended needs a run.
