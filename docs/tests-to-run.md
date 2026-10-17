# Tests to catch bugs in the partial cutter

In priority order. For each: what to do, what should happen, and what counts as a bug. When something goes wrong, keep the partial (RLE) and rule, the options you picked, the files and command the cutter made, and the start of rlife's log.

## A. rlife runs (things never confirmed)

These test whether rlife accepts what the cutter writes. Run each for about a minute with `export LLSSS_HALT_ON_ENDS=true`.

1. **Re-search a marked region, rest kept fixed** (`region-test.zip`, file `fixed.in` and `fixed-pre.cstr`).
   - *Should:* run with "Completed w_pos" lines; the printed partials show the body unchanged and the branch changing.
   - *Bug:* an error about `--constraint` or the `.cstr` file; `bcol 0 B, col 0 B` at the start; the body changing in the printed partials.
2. **Search a marked part alone** (`region-test.zip`, file `alone.in`).
   - *Should:* run, with a narrow window (about 23 columns).
   - *Bug:* rlife refusing the file, or an immediate stop with no states.
3. **Along drawn line** on an orthogonal partial (for example the 3c/7 example: Extend, Along drawn line, draw a line that dips on one side).
   - *Should:* run; this uses the same fixed-cell trick as test 1.
   - *Bug:* same as test 1.
4. **"Use rlife commands" on an asymmetric orthogonal partial** (any non-symmetric orthogonal ship you have).
   - *Should:* rlife builds its own start file from `p1.rle` and searches.
   - *Bug:* the search dying at once. This happened on every diagonal and knightwise partial tried so far; if it also happens here, `@yolo_1gp` is unusable for cut partials.
5. **Split into branches, axis column only** and **Empty axis columns with Symmetric edge**, on a symmetric partial whose back has split.
   - *Should:* run.
   - *Bug:* constraint errors, or an immediate stop.

## B. Reading partials

Paste each and check the stats panel (speed, geometry, symmetry, first error) before using the output.

6. **The same ship three ways:** one generation; all generations side by side; a grid copied from an rlife log of it.
   - *Should:* the same speed, geometry and symmetry each time.
   - *Bug:* different readings.
7. **A wrong rule:** paste a partial with the Rule box set to the wrong rule (for example B3/S23 for your B3/S234w ship).
   - *Should:* a clear message that the grid doesn't follow the rule; for a log grid, a suggested rule.
   - *Bug:* a confident reading with nonsense speed, or a "breaks almost immediately" message.
8. **RLE header rule:** paste an RLE whose header names a rule different from the Rule box.
   - *Should:* the Rule box changes to the header's rule, with a banner saying so.
9. **Halves from logs:** paste an odd half and an even half copied from symmetric searches.
   - *Should:* read as halves, with `--left-edge odd` / `--left-edge even` in the command.
   - *Bug:* read as full width, or as the other parity.
10. **Diagonal log grid:** paste a partial printed by a diagonal search (symmetric and full width).
    - *Should:* read as cNd, half or full width as appropriate.
11. **A complete ship** (no errors).
    - *Should:* each mode either works from the back or says there's nothing to fix.
    - *Bug:* a crash, a blank page, or a file that cuts into the middle of the ship.

## C. The page itself

12. **Every choice:** for one orthogonal and one knightwise partial, go through every Extend and Split combination.
    - *Should:* each either builds or is greyed out with a reason on hover.
    - *Bug:* a choice that builds nothing and shows no reason, or a red error in the browser console.
13. **The rectangle tool:** in both new choices, drag a box, Undo, drag again, Reset, change the Generation menu.
    - *Should:* the Region / Marked part stat changes each time; Reset goes back to "around the errors".
    - *Bug:* the stat not changing after a drag; the box drawn somewhere other than where you dragged.
14. **Saving:** in a mode with constraint files (region, axis column, empty axis columns, drawn line), press every Save button.
    - *Should:* each file downloads with the names in the command (`p1.in`, `p1-pre.cstr`, `p1-axis.cstr`); the online copy adds `.txt`.
15. **Reload:** set a rule, pattern, choice and the switch, then reload.
    - *Should:* everything comes back as you left it.
16. **Phone width:** open the page on a phone or a narrow window.
    - *Should:* no sideways scrolling; the switch, picker and panel usable.

## D. Things to check by eye in the output

17. **Root markers:** the first line of a recentering start file. `LLL…RRR` for full-width searches, `uuu…RR` (no L) for halves with a symmetry edge.
18. **Question marks:** one solid rectangle reaching the bottom; nothing below it but question marks and `.`.
19. **Constraint files:** the same width and root markers as the start file (rlife refuses them otherwise).
20. **mid_steps:** the last number in the command is between 06 and 08.
